import User from "../models/user.model.js";
import Post from "../models/post.model.js";

// Get all registered editors
const getAllEditors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const editors = await User.find({ role: "editor" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalEditors = await User.countDocuments({ role: "editor" });

    res.status(200).json({
      editors,
      totalEditors,
      totalPages: Math.ceil(totalEditors / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching editors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all registered salespersons
const getAllSalespersons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const salespersons = await User.find({ role: "salesperson" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalSalespersons = await User.countDocuments({
      role: "salesperson",
    });

    res.status(200).json({
      salespersons,
      totalSalespersons,
      totalPages: Math.ceil(totalSalespersons / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching salespersons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get detailed information about a specific user
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Additional data based on user role
    let additionalData = {};
    if (user.role === "salesperson") {
      // Get all bids placed by this salesperson
      const postsWithBids = await Post.aggregate([
        { $match: { "bid.user": userId } },
        { $project: { bid: 1 } },
      ]);

      const totalBids = postsWithBids.reduce(
        (acc, post) => acc + post.bid.length,
        0
      );
      additionalData.totalBids = totalBids;
    } else if (user.role === "editor") {
      // Get all posts created by this editor
      const totalPosts = await Post.countDocuments({ createdBy: userId });
      additionalData.totalPosts = totalPosts;
    }

    res.status(200).json({
      ...user,
      ...additionalData,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("createdBy", "name email") // Show editor info
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
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a post with all bid details
const getPostWithAllBids = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("createdBy", "name email") // Editor info
      .populate("bid.user", "name email company") // Bidder info
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Sort bids by amount (descending)
    post.bid.sort((a, b) => b.amount - a.amount);

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post with bids:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin can delete any post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Get all pending salesperson approvals
const getPendingApprovals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pendingSalespersons = await User.find({
      role: 'salesperson',
      isApproved: false
    })
    .select('-password')
    .skip(skip)
    .limit(limit)
    .lean();

    const totalPending = await User.countDocuments({
      role: 'salesperson',
      isApproved: false
    });

    res.status(200).json({
      pendingSalespersons,
      totalPending,
      totalPages: Math.ceil(totalPending / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Approve a salesperson
const approveSalesperson = async (req, res) => {
  try {
    const { userId } = req.params;

    const salesperson = await User.findOneAndUpdate(
      { 
        _id: userId, 
        role: 'salesperson',
        isApproved: false 
      },
      { 
        isApproved: true,
        rejectionReason: '' // Clear any previous rejection reason
      },
      { new: true }
    );

    if (!salesperson) {
      return res.status(404).json({ message: "Salesperson not found or already approved" });
    }

    // Send approval email notification (you would implement this)
    // sendApprovalEmail(salesperson.email);

    res.status(200).json({ 
      message: "Salesperson approved successfully",
      salesperson 
    });
  } catch (error) {
    console.error("Error approving salesperson:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject a salesperson
const rejectSalesperson = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const salesperson = await User.findOneAndUpdate(
      { 
        _id: userId, 
        role: 'salesperson',
        isApproved: false 
      },
      { 
        rejectionReason: reason 
      },
      { new: true }
    );

    if (!salesperson) {
      return res.status(404).json({ message: "Salesperson not found or already approved" });
    }

    // Send rejection email notification (you would implement this)
    // sendRejectionEmail(salesperson.email, reason);

    res.status(200).json({ 
      message: "Salesperson rejected successfully",
      salesperson 
    });
  } catch (error) {
    console.error("Error rejecting salesperson:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific salesperson's application details
const getSalespersonApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const salesperson = await User.findOne({
      _id: userId,
      role: 'salesperson'
    })
    .select('-password')
    .lean();

    if (!salesperson) {
      return res.status(404).json({ message: "Salesperson not found" });
    }

    res.status(200).json(salesperson);
  } catch (error) {
    console.error("Error fetching salesperson application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export {
  getAllEditors,
  getAllSalespersons,
  getUserDetails,
  getAllPosts,
  getPostWithAllBids,
  deletePost,
  getPendingApprovals,
  approveSalesperson,
  rejectSalesperson,
  getSalespersonApplication
};
