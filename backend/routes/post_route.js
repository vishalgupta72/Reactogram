const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");
const protectedRoute = require("../middleware/protectedResource");

// all user posts
router.get("/allposts", (req, res) => {
  PostModel.find()
    .populate("author", "_id fullName profileImg")
    .populate("comments.commentedBy", "_id fullName")
    .then((dbPosts) => {
      res.status(200).json({ posts: dbPosts });
    })
    .catch((error) => {
      console.log(error);
    });
});

// all user posts for logged in user
router.get("/myallposts", protectedRoute, (req, res) => {
  PostModel.find({ author: req.user._id })
    .populate("author", "_id fullName profileImg")
    .then((dbPosts) => {
      res.status(200).json({ posts: dbPosts });
    })
    .catch((error) => {
      console.log(error);
    });
});

// create the post
router.post("/createpost", protectedRoute, (req, res) => {
  const { description, location, image } = req.body;
  if (!description || !location || !image) {
    return res
      .status(400)
      .json({ error: "One or more mandatory field are empty" });
  }
  req.user.password = undefined;
  const postObj = new PostModel({
    description: description,
    location: location,
    image: image,
    author: req.user,
  });
  postObj
    .save()
    .then((newPost) => {
      res.status(201).json({ post: newPost });
    })
    .catch((error) => {
      console.log(error);
    });
});

// delete posts
router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
  try {
    const postFound = await PostModel.findOne({
      _id: req.params.postId,
    }).populate("author", "_id");

    if (!postFound) {
      return res.status(400).json({ error: "Post does not exist" });
    }

    // check if the post author is same as loggedin user only then allow deletionvd
    if (postFound.author._id.toString() === req.user._id.toString()) {
      console.log(postFound.image.delete_url);

      try {
        const picDelRes = await fetch(postFound.image.delete_url.toString(), {
          method: "DELETE",
        });
        console.log(picDelRes);
      } catch (er) {
        console.error(er);
      }

      const delRes = await postFound.deleteOne();
      return res.status(200).json({ result: "Post deleted successfully" });
    }
  } catch (er) {
    console.error(er);
  }

  return res
    .status(400)
    .json({ error: "post does not exist or unable to delete at this time!" });
});

// like for post
router.put("/like", protectedRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.body.postId);

    // Check if the user has already liked the post
    if (post.likes.includes(req.user._id)) {
      return res
        .status(400)
        .json({ error: "User has already liked this post." });
    }

    // If not liked already, add the like
    const result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("author", "_id fullName")
      .exec();

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// dislike
router.put("/unlike", protectedRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.body.postId);

    // Check if the user has liked the post before trying to unlike it
    if (!post.likes.includes(req.user._id)) {
      return res
        .status(400)
        .json({ error: "User has not liked this post yet." });
    }

    const result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("author", "_id fullName")
      .exec();

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// comments on Post
router.put("/comment", protectedRoute, async (req, res) => {
  try {
    const comment = {
      commentText: req.body.commentText,
      commentedBy: req.user._id,
    };
    const result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.commentedBy", "_id fullName") // comments owner
      .populate("author", "_id fullName")
      .exec(); //post owner

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
