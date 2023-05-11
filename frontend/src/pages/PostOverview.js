import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2'
import axios from 'axios';
const PostOverview = () => {

  const [allposts, setAllposts] = useState([]);

  const CONFIG_OBJ = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
}

  const getAllPosts = async() =>{
    const response = await axios.get(`${API_BASE_URL}/allposts`);
    if(response.status === 200){
      setAllposts(response.data.posts);
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Some error occurred while getting all posts!'
    })
    }
  }

  const deletePost = async(postId) =>{
    const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
    if(response.status === 200){
      Swal.fire({
        icon: 'success',
        title: 'Post deleted successfully!'
    })
    getAllPosts();
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Some error occurred while deleting post!'
    })
    }
  }


  useEffect(()=>{
    getAllPosts();
  }, []);

  return (
    <div className='container'>
      <div className="row">

        
          {allposts.map((post) =>{
              return(
                <div className="col-md-4">
                    <Card postData={post} deletePost={deletePost} getAllPosts={getAllPosts} />
                </div>
              )
          })}
          
        

       

      </div>
      
    </div>
  )
}

export default PostOverview
