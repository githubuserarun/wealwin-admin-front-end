import React, { useState, useEffect } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';
import { toast } from 'react-toastify';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPassShow, setIsPassShow] = useState(false);

  const navigate = useNavigate();
  // const isUser = Cookies.get('jwtToken');
  // const isAdmin = Cookies.get('jwtAdminToken')

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.msg);
        return;
      }

      const data = await response.json();
      console.log('Login successful, JWT token:', data.token);
      toast.success("Login successful")

      const jwtToken = data.token;
      if (data.admin) {
        Cookies.set('jwtAdminToken', jwtToken, { expires: 3 });
      }
      else {
        Cookies.set('jwtToken', jwtToken, { expires: 3 });
      }


      setUsername('');
      setPassword('');
      console.log(data)
      if (data.admin) {
        navigate('/');
      } else {
        navigate('/admin-login');
      }

    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const navToSignup = () => {
    navigate('/signup')
  }
  const togglePassword = () => {
    setIsPassShow(!isPassShow);
  }

  useEffect(() => {
    // if (isAdmin !== undefined) {
    //   navigate('/')
    // }
    // if (isUser !== undefined) {
    //   navigate('/')
    // }
  }, [navigate]);

  return (
    <div className='container d-flex justify-content-between align-items-center'>
      <div className="form-container d-flex flex-column justify-content-around">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className='input'>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

          </div>

          <div className='password '>
            <input
              type={isPassShow ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type='button' className='icon' onClick={togglePassword}>
              {isPassShow ? <FaRegEyeSlash /> : <FaRegEye />}</button>

          </div>
          <Link className='link text-end mt-3 mb-3' to='/request'>forgot password?</Link>

          <button type="submit">Login</button>
          
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
