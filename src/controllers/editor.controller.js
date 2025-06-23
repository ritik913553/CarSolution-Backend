import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const createPost = async (req, res) => {
  try {
    const editorId = req.user._id; // Assuming you have authentication middleware

    // Validate editor role
    const editor = await User.findById(editorId);
    if (!editor || editor.role !== "editor") {
      return res.status(403).json({ message: "Only editors can create posts" });
    }

    const {
      name,
      model,
      brand,
      budget,
      carType,
      variant,
      fuelType,
      transmission,
      image,
    } = req.body;

    const newPost = new Post({
      createdBy: editorId,
      name,
      model,
      brand,
      budget,
      carType,
      variant,
      fuelType,
      transmission,
      image,
      bid: [],
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const editorId = req.user._id;

    // Get all posts by this editor with bid summary
    const posts = await Post.aggregate([
      { $match: { createdBy: editorId } },
      {
        $project: {
          _id: 1,
          name: 1,
          model: 1,
          brand: 1,
          budget: 1,
          carType: 1,
          variant: 1,
          fuelType: 1,
          transmission: 1,
          image: 1,
          createdAt: 1,
          totalBids: { $size: "$bid" },
          topBids: {
            $slice: [
              {
                $sortArray: {
                  input: "$bid",
                  sortBy: { amount: -1 },
                },
              },
              2,
            ],
          },
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    const editorId = req.user._id;

    // First verify the post belongs to this editor
    const postExists = await Post.exists({ _id: postId, createdBy: editorId });
    if (!postExists) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    // Get the post with bid counts and top amounts without revealing bidder info
    const post = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      {
        $project: {
          _id: 1,
          name: 1,
          model: 1,
          brand: 1,
          budget: 1,
          carType: 1,
          variant: 1,
          fuelType: 1,
          transmission: 1,
          image: 1,
          createdAt: 1,
          totalBids: { $size: "$bid" },
          topBids: {
            $slice: [
              {
                $map: {
                  input: {
                    $sortArray: {
                      input: "$bid",
                      sortBy: { amount: -1 },
                    },
                  },
                  as: "bid",
                  in: {
                    amount: "$$bid.amount",
                    bidAt: "$$bid.bidAt",
                  },
                },
              },
              2,
            ],
          },
        },
      },
    ]);

    if (!post || post.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Calculate the number of salespersons who have not bidded
    const totalSalespersons = await User.countDocuments({
      role: "salesperson",
    });
    const notBiddedCount = totalSalespersons - post[0].totalBids;

    const response = {
      ...post[0],
      notBiddedCount: notBiddedCount > 0 ? notBiddedCount : 0,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const editorId = req.user._id;
    const updates = req.body;

    // Check if post exists and belongs to editor
    const post = await Post.findOne({ _id: postId, createdBy: editorId });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    // Check if bids have been placed
    if (post.bid.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot update post after bids have been placed" });
    }

    // Update allowed fields
    const allowedUpdates = [
      "name",
      "model",
      "brand",
      "budget",
      "carType",
      "variant",
      "fuelType",
      "transmission",
      "image",
    ];
    const isValidUpdate = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid updates" });
    }

    Object.assign(post, updates);
    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const editorId = req.user._id;

    // Check if post exists and belongs to editor
    const post = await Post.findOne({ _id: postId, createdBy: editorId });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    // Check if bids have been placed
    if (post.bid.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete post after bids have been placed" });
    }

    await Post.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export  {
  createPost,
  getMyPosts,
  getPostDetails,
  updatePost,
  deletePost,
};
