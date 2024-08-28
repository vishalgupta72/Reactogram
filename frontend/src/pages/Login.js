import './Login.css'
import socialDesktop from '../images/social-desktop.PNG'
import socialMobile from '../images/social-mobile.PNG'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {API_BASE_URL} from '../../src/config'
import Swal from 'sweetalert2'

import {useDispatch} from 'react-redux'

const Login = () =>{
    // debugger;



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const login = (event) =>{
        event.preventDefault();
        setLoading(true);
        const requestData = {email, password}
        axios.post(`${API_BASE_URL}/login`, requestData)
        .then((result)=>{
            if(result.status === 200){
                setLoading(false);
                localStorage.setItem("token", result.data.result.token);
                localStorage.setItem("user", JSON.stringify(result.data.result.user));
                // console.log(result.data.result.user);
                dispatch({type: 'LOGIN_SUCCESS', payload: result.data.result.user});
                setLoading(false); 

                navigate('/myprofile');
            }
            setEmail('');
            setPassword('');
        })
        .catch((error)=>{
            setLoading(false);
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Some error occurred please try again later!'
            })
        })
        
    }



    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-7 col-sm-12 d-flex justify-content-center align-items-center">
                    <img className="socialDesktop" style={{height: '90%'}} src={socialDesktop} alt="desktop icon" />
                    <img className="socialMobile" src={socialMobile} alt="Mobile icon" />
                </div>

                {/* lOGIN PART */}
                <div className="col-md-4 col-sm-12 offset-1 mt-2">
                    <div className="card shadow">

                         {/* Loading part */}
                   { loading? <div className="col-md-12 mt-3 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> :''}

                        
                        <div className="card-body px-5">
                            <h4 className="card-tittle text-center fw-bold mt-3">Log in</h4>
                            <form onSubmit={(e)=>login(e)}>
                                <input type="email" value={email} onChange={(ev)=>setEmail(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" name="email" placeholder="Phone number, username, or email" />
                                <input type="password" value={password} onChange={(ev)=>setPassword(ev.target.value)} className="p-2 mb-2 form-control input-bg" name="password" placeholder="password" />
                                <div className="d-grid mt-3">
                                    <button className="custom-btn custom-btn-blue" type='submit'>Log in</button>
                                </div>

                                <div className="my-4">
                                    <hr className="text-muted" />
                                    <h5 className="text-muted text-center"> OR</h5>
                                    <hr className="text-muted" />
                                </div>

                                <div className="mt-3 mb-5 d-grid">
                                    <button className="custom-btn custom-btn-white">
                                        <span className="text-muted fs-6">Don't have an account?</span>
                                        <Link to="/singup" className="ms-1 text-info fw-bold">Singup</Link>
                                    </button>
                                </div>

                                
                            </form>
                        </div>
                    </div>
                </div>

                {/* end lOGIN PART */}
            </div>
        </div>
    );
}

export default Login;