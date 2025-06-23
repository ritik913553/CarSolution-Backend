# `CarSolution-Backend`

## Controllers Overview

## 1. **Admin Controller**
Handles all admin-level operations.

### Functions:
- **getAllEditors** : Get  list of all registered editors.
- **getAllSalespersons** : Get  list of all registered salespersons.
- **getUserDetails** : Get detailed information about a specific user, including stats based on their role.
- **getAllPosts** : Get  list of all posts, including editor info.
- **getPostWithAllBids** : Get a post with all bid details, including bidder and editor info.
- **deletePost** : Delete any post by its ID.
- **getPendingApprovals** : Get all pending salesperson applications for approval.
- **approveSalesperson** : Approve a salesperson's application.
- **rejectSalesperson** : Reject a salesperson's application with a reason.
- **getSalespersonApplication** : Get details of a specific salesperson's application.

---

## 2. **Editor Controller**
Manages actions available to editors.

### Functions:
- **createPost** : Create a new car post.
- **getMyPosts** : Get all posts created by the editor, including bid summaries and top bids.
- **getPostDetails** : Get detailed information about a specific post, including bid stats and top bid amounts.
- **updatePost** : Update a post (only if no bids have been placed).
- **deletePost** : Delete a post (only if no bids have been placed).

---

## 3. **SalesPerson Controller**
Handles actions for salespersons.

### Functions:
- **getAvailablePosts** : View available posts matching the salesperson's assigned brands.
- **getAllPosts** : View all posts (for reference).
- **placeBid** : Place a bid on a post.
- **getMyBidPost** : View all posts where the salesperson has placed bids, including their bid details.
- **updateBid** : Update an existing bid placed by the salesperson.
- **withdrawBid** : Withdraw (remove) a bid placed by the salesperson.

---

## 4. **User Controller**
