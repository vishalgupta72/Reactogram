import './Login.css'
import socialDesktop from '../images/social-desktop.PNG'
import socialMobile from '../images/social-mobile.PNG'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {API_BASE_URL} from '../../src/config'
import Swal from 'sweetalert2'


const Singup = () =>{


    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState("");

    const signup = (event) =>{
        event.preventDefault();
        setLoading(true);
        const requestData = {fullName: fullName, email, password}
        axios.post(`${API_BASE_URL}/singup`, requestData)
        .then((result)=>{
            debugger;
            if(result.status === 201){
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'User successfully registered'
                })
            }
            setFullName('');
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

                {/* Singup PART */}
                <div className="col-md-4 col-sm-12 offset-1 mt-2">
                    <div className="card shadow">

                    {/* Loading part */}
                   { loading? <div className="col-md-12 mt-3 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> :''}

                        <div className="card-body px-5">
                            <h4 className="card-tittle text-center fw-bold mt-3">Sing up</h4>
                            <form onSubmit={(e)=>signup(e)}>
                                <input type="phone" className="p-2 mt-4 mb-2 form-control" name="phone" value="+91 XXXXX XXXXX" placeholder="Phone number" />
                                <input type="text" value={fullName} onChange={(ev)=>setFullName(ev.target.value)} className="p-2 mb-2 form-control input-bg" name="name" placeholder="Full Name" />
                                <input type="email" value={email} onChange={(ev)=>setEmail(ev.target.value)} className="p-2 mb-2 form-control input-bg" name="email" placeholder="email" />
                                <input type="password" value={password} onChange={(ev)=>setPassword(ev.target.value)} className="p-2 mb-2 form-control input-bg" name="password" placeholder="password" />
                                <div className="d-grid mt-3">
                                    <button className="custom-btn custom-btn-blue" type='submit'>Sing up</button>
                                </div>

                                <div className="my-4">
                                    <hr className="text-muted" />
                                    <h5 className="text-muted text-center"> OR</h5>
                                    <hr className="text-muted" />
                                </div>

                                <div className="mt-3 mb-5 d-grid">
                                    <button className="custom-btn custom-btn-white">
                                        <span className="text-muted fs-6">Already have an account?</span>
                                        <Link to="/login" className="ms-1 text-info fw-bold">Login</Link>
                                    </button>
                                </div>

                                
                            </form>
                        </div>
                    </div>
                </div>

                {/* end SINGUP PART */}
            </div>
        </div>
    );
}

export default Singup;