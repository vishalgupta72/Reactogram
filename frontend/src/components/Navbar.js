import './Navbar.css'
import {NavLink, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'


const Navbar = () =>{

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state=>state.userReducer);

    // console.log(user);

    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({type: "LOGIN_ERROR"});
        navigate("/login");
    }

    return(
        <>
        <nav className="navbar navbar-light bg-light shadow-sm">
        <div className="container-fluid">
            <a className="navbar-brand"><i className="fa-brands fa-instagram"></i> Reactogram</a>
             <form className="d-flex me-md-5 me-sm-1">
                <input className="searchBox form-control me-4 text-muted" type="search" placeholder="Search" aria-label="Search" />
                <a className="nav-link search-icon me-4 fs-5" onClick={(e) => e.preventDefault()}><i className="fa-solid fa-magnifying-glass"></i></a>
                <NavLink className="nav-link me-4 fs-5" to="/posts"><i className="fa-solid fa-house"></i></NavLink>
                { localStorage.getItem("token") !== null ?  <NavLink className="nav-link me-4 fs-5"><i className="fa-regular fa-heart"></i></NavLink> : ''}

                 <div className="dropdown">
                    {/* <button className="me-2 fs-5"data-bs-toggle="dropdown">
                        <img className='p-2 nav-profile-pic' src="https://images.unsplash.com/photo-1524860769472-246b6afea403?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="img"  />
                    </button> */}
                  { localStorage.getItem("token") !== null ? <> <img className='p-2 nav-profile-pic' data-bs-toggle="dropdown" src="https://images.unsplash.com/photo-1524860769472-246b6afea403?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="img"  />
                    
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><NavLink className="dropdown-item ms-1 p-2" to="/myprofile"><i className="fa-regular fa-user"></i> Profile</NavLink></li>
                        <li><a className="dropdown-item" onClick={()=>logout()}><i className="fa-solid fa-right-from-bracket"></i> Logout</a></li>
                    </ul> </> : ''}
                </div> 
            </form> 
        </div>
        </nav>
        </>
    );
}

export default Navbar;
