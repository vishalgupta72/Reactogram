import React, { useState, useEffect } from 'react'
import './Profile.css'

// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

const Profile = () => {

    const user = useSelector(state => state.userReducer);

    const [image, setImage] = useState({preview: '', data: ''})

    const navigate = useNavigate();

    let imgName = "";
    const [myallposts, setMyallposts] = useState([]);
    const [show, setShow] = useState(false);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [postDetail, setPostDetail] = useState({});


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showPost, setShowPost] = useState(false);

  const handlePostClose = () => setShowPost(false);
  const handlePostShow = () => setShowPost(true);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }



    const deletePost = async(postId) =>{
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
        if(response.status === 200){
          Swal.fire({
            icon: 'success',
            title: 'Post deleted successfully!'
        })
        getMyPosts();
        setShow(false);
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Some error occurred while deleting post!'
        })
        }
      }


  const handleFileSelect = (event) =>{
    const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0]
    }
    setImage(img);
  }

  const handleImgUpload = async ()=>{
    let formData = new FormData();
    imgName = image.data.name;
    formData.append('file', image.data);

    const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
    return response;
  }



  const getMyPosts = async() =>{
    const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_OBJ);
    if(response.status === 200){
        setMyallposts(response.data.posts);
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Some error occurred while getting all posts!'
        })
    }
    }

    const showDetail = (post)=>{
        setPostDetail(post);
    }


  const addPost = async() =>{


    if(image.preview === ''){
        Swal.fire({
            icon: 'error',
            title: 'Post image is mendatory!'
        })
    }
    else if(caption === ''){
        Swal.fire({
            icon: 'error',
            title: 'Post caption is mendatory!'
        })
    }
    else if(location === ''){
        Swal.fire({
            icon: 'error',
            title: 'Post location is mendatory!'
        })
    }
    else{
        setLoading(true);
        const imgRes = await handleImgUpload();
 
        // add validation rule for caption and location
        const request = {description: caption, location: location, image: `${API_BASE_URL}/files/${imgName}`}
        // write api call to create post
        const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ)
        // console.log(request)
        setLoading(false);
        if(postResponse.status === 201){
            navigate("/posts");
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Some error occurred while creating post!'
            })
        }
    }

    
  }

  useEffect(()=>{
    getMyPosts();
  }, []);

  return (
    <div className="container shadow mt-3 p-3">
        <div className="row">

            {/* Left part of profile page */}
            <div className="col-md-6 d-flex flex-column">
                <img className='p-2 profile-pic' src="https://images.unsplash.com/photo-1524860769472-246b6afea403?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="img"  />

                <p className='fs-6 fw-bold ms-4'>vishal.g72</p>
                <p className='fs-6 ms-4 m-0'>{user.user.fullName}</p>
                <p className='fs-6 ms-4 m-0'>MERN Developer @praveen | Follow @sid0542</p>
                <p className='fs-6 ms-4'>My portfolio on <a href="!#">www.portfolio.com/vishalgupta</a></p>
            </div>


            {/* Right part of profile page */}
            <div className="col-md-6 d-flex flex-column justify-content-between">
                <div className='d-flex justify-content-equal mx-auto'>
                    <div className="count-section text-center fw-bold p-2 pe-3 pe-md-5 ps-md-5">
                        <h4>{myallposts.length}</h4>
                        <p>Posts</p>
                    </div>
                    <div className="count-section text-center fw-bold p-2 pe-2 pe-md-5 ps-md-5">
                        <h4>20</h4>
                        <p>Followers</p>
                    </div>
                    <div className="text-center fw-bold p-2 pe-md-5 ps-md-5">
                        <h4>30</h4>
                        <p>Following</p>
                    </div>
                </div>
                
                {/* bottom part */}
                <div className='mx-auto mt-3'>
                    <button className="custom-btn custom-btn-white m-3">
                        <span className="fs-6">Edit Profile</span>
                    </button>
                    <button className="custom-btn custom-btn-white">
                        <span className="fs-6" onClick={handlePostShow}>Upload Post</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="row my-3">
            <hr />
        </div>

        <div className="row mb-4">
            {myallposts.map((post) =>{
                return(
                    <div className="col-md-4 col-sm-12 mb-3" key={post._id}>
                        <div className="card shadow" onClick={handleShow}>
                            <img onClick={()=>showDetail(post)} src={post.image} alt={post.description} />
                        </div>
                    </div>
                )
            })}
            {/* first card of post */}
           

        </div>



        {/* first modal for upload post */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
        
    
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-md-6 col-sm-12 ">
                    <div>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                            <img src={postDetail.image} className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1677784976154-816c3ceca511?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1676676701269-65de47175adf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80" className="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">

                    {/* user info */}
                    <div className="row">
                        <div className="col-12 d-flex">
                            <img className='p-2 profile-pic' src="https://images.unsplash.com/photo-1524860769472-246b6afea403?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="img"  />
                            <div className="d-flex flex-column justify-content-center mt-2">
                                <p className='fs-6 fw-bold'>{postDetail.location}</p>
                                <p className='location'>{postDetail.description}</p>
                            </div>


                            <div className="dropdown">
                                <button className="btn mt-3 ms-5" type="button" data-bs-toggle="dropdown">
                                    <a href className='fs-4 float-end'><i className="fa-solid fa-ellipsis"></i></a>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a className="dropdown-item" href="!#"><i className="fa-regular fa-pen-to-square"></i> Edit Post</a></li>
                                    <li><a className="dropdown-item" onClick={()=> deletePost(postDetail._id)}><i className="fa-solid fa-trash-can"></i> Delete Post</a></li>
                                </ul>
                            </div>


                        </div>

                        
                    </div>


                    <div className="row">
                        <div className="col-12">
                            <span className="p-2 text-muted">2 Hours ago</span>
                        </div>
                    </div>


                    {/* post description */}
                    <div className="row">
                        <div className="ms-2">
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>
                    
                    

                     {/* likes, comments, and share */}
                    <div className="row mt-2">
                        <div className="col-6 d-flex">
                            <i className="fa-regular fa-heart fs-5 pe-2 ps-2"></i>
                            <i className="fa-regular fa-comment fs-5 pe-2"></i>
                            <i className="fa-solid fa-location-arrow fs-5 pe-2"></i>
                        </div>

                        <div className="col-12">
                            <span className='ps-2 fw-bold fs-6'>200 Likes</span>
                        </div>
                    </div>

                    
                </div>
            </div>
        </Modal.Body>
      </Modal>



      {/* Second modal for upload post */}
      
      <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
        <Modal.Header closeButton>
            <span className='fs-5 fw-bold'>Upload Post</span>
        </Modal.Header>
        <Modal.Body>
            <div className="row">

                {/* left part  */}
                <div className="col-md-6 col-sm-12 mb-3">
                    <div className="upload-box">
                        <div className="dropzoneContainer">
                            <input name="file" type="file" id="drop zone" className="fileUpload" accept=".jpg, .png, .gif" onChange={handleFileSelect} /> 
                            <div className="dropZoneOverlay">
                                {image.preview && <img src={image.preview} width='150' height='150' />}
                                <i className="fa-solid fa-cloud-arrow-up fs-1"></i><br/>upload photo from your computer</div> 
                        </div>
                    </div>
                </div>

                {/* right part */}
                <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-between">

                <div className="row">
                    <div className="col-sm-12">
                        <div className="form-floating mb-4">
                            <textarea onChange={(ev) => setCaption(ev.target.value)} className="form-control" placeholder="Add caption" id="floatingTextarea"></textarea>
                            <label for="floatingTextarea">Add caption</label>
                        </div>
                    </div>


                    <div className="col-sm-12">
                        <div className="form-floating mb-3">
                            <input onChange={(ev) => setLocation(ev.target.value)} type="text" className="form-control" id="floatingInput" placeholder="location" />
                            <label for="floatingInput"><i className="fa-solid fa-location-pin"></i> Add Location</label>
                        </div>
                    </div>

                </div>
               
                <div className="row">
                    <div className="col-sm-12 pe-4">
                    { loading? <div className="col-md-12 mt-3 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> :''}
                    <button onClick={()=>addPost()} className="custom-btn-pink float-end">Post</button>
                    </div>
                </div>

                </div>
            </div>
        </Modal.Body>
      </Modal>




    </div>
  )
}

export default Profile
