import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Singup from './pages/Singup';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PostOverview from './pages/PostOverview';
import Profile from './pages/Profile';

import {NavLink, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react';



function App() {

  function DynamicRoutic(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state=>state.userReducer); 

    useEffect(() => {
      const userData = localStorage.getItem("user");

      if(userData){
        dispatch({type: "LOGIN_SUCCESS", payload: userData});
        navigate("/posts");
      }
      else{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({type: "LOGIN_ERROR"});
        navigate("/login");
      }
    }, []);

    return(
      <Routes>
      <Route exact path="/" element={<PostOverview/>}></Route>
      <Route exact path="/login" element={<Login/>}></Route>
      <Route exact path="/singup" element={<Singup/>}></Route>
      <Route exact path="/posts" element={<PostOverview/>}></Route>
      <Route exact path="/myprofile" element={<Profile/>}></Route>
    </Routes>
    )

  }

    


  return (
    <div className='bg-color'>
    
      <Router>
      <Navbar />
       <DynamicRoutic/>
      </Router>
    </div>
  );
}

export default App;
