import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Get all available posts that match salesperson's brand(s)
// const getAvailablePosts = async (req, res) => {
//   try {
//     const salespersonId = req.user._id;

//     const salesperson = await User.findById(salespersonId);
//     if (!salesperson || salesperson.role !== 'salesman') {
//       return res.status(403).json({ message: "Unauthorized access" });
//     }

//     const salespersonBrands = salesperson.brands || [];

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const query = salespersonBrands.length > 0
//       ? { brand: { $in: salespersonBrands } }
//       : {};

//     const posts = await Post.find(query)
//       .select('-bid')
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     const totalPosts = await Post.countDocuments(query);

//     res.status(200).json({
//       posts,
//       totalPosts,
//       totalPages: Math.ceil(totalPosts / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     console.error("Error fetching available posts:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getAvailablePosts = async (req, res) => {
  try {
    const salespersonId = req.user._id;

    // Verify salesperson exists and has correct role
    const salesperson = await User.findById(salespersonId);
    if (!salesperson || salesperson.role !== "salesman") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const salespersonBrands = salesperson.brandName || [];
    // console.log("Salesperson Brands:", salespersonBrands);

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only query posts if salesperson has brands assigned
    let posts = [];
    let totalPosts = 0;

    if (salespersonBrands.length > 0) {
      posts = await Post.find({ brand: { $in: salespersonBrands } })
        // .select("-bid") // Exclude bid information
        .skip(skip)
        .limit(limit)
        .lean();

      totalPosts = await Post.countDocuments({
        brand: { $in: salespersonBrands },
      });
    }
    console.log("Posts:", posts);

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching available posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all posts   Mix of all brand
const getAllPosts = async (req, res) => {
  try {
    if (req.user.role !== "salesman") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      // .select("-bid")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Place a bid on a post
const placeBid = async (req, res) => {
  try {
    const salespersonId = req.user._id;
    const postId = req.params.postId;
    // console.log(req.body);

    const { amount } = req.body;

    if (isNaN(amount) || amount  <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingBidIndex = post.bid.findIndex((b) =>
      b.user.equals(salespersonId)
    );
    if (existingBidIndex !== -1) {
      return res
        .status(400)
        .json({ message: "You already placed a bid on this post" });
    }

    post.bid.push({
      user: salespersonId,
      amount: amount,

      bidAt: new Date(),
    });

    await post.save();

    res.status(201).json({ message: "Bid placed successfully" });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all posts where the current salesperson have placed bids
const getMyBidPost = async (req, res) => {
  try {
    const salespersonId = req.user._id;

    const salesperson = await User.findById(salespersonId);
    if (!salesperson || salesperson.role !== "salesman") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      { $match: { "bid.user": salespersonId } },
      {
        $project: {
          _id: 1,
          name: 1,
          model: 1,
          brand: 1,
          budget: 1,
          carType: 1,
          createdAt: 1,
          myBid: {
            $filter: {
              input: "$bid",
              as: "bid",
              cond: { $eq: ["$$bid.user", salespersonId] },
            },
          },
          totalBids: { $size: "$bid" },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPosts = await Post.countDocuments({ "bid.user": salespersonId });

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching my bids:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing bid
const updateBid = async (req, res) => {
  try {
    const salespersonId = req.user._id;
    const { postId } = req.params;
    const { amount } = req.body;

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid bid amount - must be a positive number" });
    }

    // Find the post
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the user's bid in the post's bids array
    const bidIndex = post.bid.findIndex(
      (b) => b.user.equals(salespersonId)  // Only check user ID since we're updating user's own bid
    );

    if (bidIndex === -1) {
      return res.status(404).json({ 
        message: "You haven't placed a bid on this post yet" 
      });
    }

    // Update the bid
    post.bid[bidIndex].amount = amount;
    post.bid[bidIndex].bidAt = new Date();

    // Save the updated post
    await post.save();

    res.status(200).json({ 
      message: "Bid updated successfully",
      updatedBid: post.bid[bidIndex]  // Optionally return the updated bid
    });
  } catch (error) {
    console.error("Error updating bid:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message  // Include error message for debugging
    });
  }
};


export {
  getAvailablePosts,
  getAllPosts,
  placeBid,
  getMyBidPost,
  updateBid,
 
};
