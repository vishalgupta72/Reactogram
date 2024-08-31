import React, { useEffect, useState } from "react";
import Card from "../components/Card";

import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
const PostOverview = () => {
  const [allposts, setAllposts] = useState([]);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const getAllPosts = async () => {
    const response = await fetch(`${process.env.SERVER_URL}/allposts`, {method:"GET"});
    if (response.status === 200) {
      const data = await response.json();
      setAllposts(data.posts);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occurred while getting all posts!",
      });
    }
  };

  const deletePost = async (postId) => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then(async (result) => {  // Make the callback async
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
          if (response.status === 200) {
            Swal.fire("Saved!", "Post deleted successfully!", "success");
            getAllPosts();
            // setShow(false);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Some error occurred while deleting post!',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Some error occurred while deleting post!',
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="container">
      <div className="row" >
        {allposts.map((post) => {
          return (
            <div className="col-md-4">
              <Card
                postData={post}
                deletePost={deletePost}
                getAllPosts={getAllPosts}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostOverview;
