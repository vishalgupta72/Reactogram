import React, { useState } from 'react'
import './Card.css'
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config';
import axios from 'axios';


const Card = (props) => {
    const user = useSelector(state => state.userReducer);
    const [commentBox, setCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }



    const submitComment = async(postId) =>{
        setCommentBox(false);
        const request = {"postId": postId, "commentText": comment};
        const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJ);

        if(response.status === 200){
            props.getAllPosts();
        }
    }



    const likeDislikePost = async(postId, type)=>{
        const request = {"postId": postId};
        const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJ);

        if(response.status === 200){
            props.getAllPosts();
        }
        
    }

  return (
    <div>
      <div className="card shadow-sm mt-md-4 mt-sm-2">
        <div className="card-body px-2 my-2">

            {/* user info */}
            <div className="row">
                <div className="col-6 d-flex">
                    <img className='p-2 profile-pic' style={{width: '70px', height: '70px'}} src="https://images.unsplash.com/photo-1524860769472-246b6afea403?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="img"  />
                    <div className="d-flex flex-column justify-content-center mt-2">
                        <p className='fs-6 fw-bold'>{props.postData.author.fullName}</p>
                        <p className='location'>{props.postData.location}</p>
                    </div>
                </div>

                <div className="col-6 ">
                    {props.postData.author._id === user.user._id ?
                    <a onClick={()=>props.deletePost(props.postData._id)} style={{cursor: 'pointer'}} href className='float-end p-3'><i class="fa-solid fa-ellipsis-vertical"></i></a>
                    : ''}
                </div>
            </div>



            {/* post image */}
            <div className="row">
                <div className="col-12">
                    {/* <img style={{borderRadius: '15px'}} className='p-2 img-fluid' src="https://images.unsplash.com/photo-1544890225-2f3faec4cd60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=725&q=80" alt="post" /> */}
                    <img style={{borderRadius: '15px'}} className='p-2 img-fluid' src={props.postData.image} alt="post" />
                </div>
            </div>



            {/* likes, comments, and share */}
            <div className="row mt-2">
                <div className="col-6 d-flex">
                    <i onClick={()=>likeDislikePost(props.postData._id, 'like')} className="fa-regular fa-heart fs-5 pe-2 ps-2"></i>
                    <i onClick={()=>likeDislikePost(props.postData._id, 'unlike')} className="fa-regular fa-thumbs-down fs-5 pe-2 ps-2"></i>
                    <i onClick={()=>setCommentBox(true)}className="fa-regular fa-comment fs-5 pe-2"></i>
                    <i className="fa-solid fa-location-arrow fs-5 pe-2"></i>
                </div>

                <div className="col-6">
                    <span className='pe-2 fw-bold fs-6 float-end'>{props.postData.likes.length} Likes</span>
                </div>
            </div>

           {/* conmmet box */}
           { commentBox ? <div className="row mt-2">
                <div className="col-8">
                    <textarea onChange={(e)=> setComment(e.target.value)} className="form-control" ></textarea>
                </div>
                <div className="col-3 p-2">
                    <button className='btn btn-primary ' onClick={()=> submitComment(props.postData._id)}>Submit</button>
                </div>
            </div> : ""}


           { props.postData.comments.map((comment)=>{

                return(
                    <div className="row">
                        <div className="col-12">
                           <p>{comment.commentText} - {comment.commentedBy.fullName}</p>
                        </div>
                    </div>
                )
           }) }


            <div className="row">
                <div className="col-12">
                    <span className="p-2 text-muted">2 Hours Ago</span>
                </div>
            </div>


        </div>
      </div>
    </div>
  )
}


export default Card
