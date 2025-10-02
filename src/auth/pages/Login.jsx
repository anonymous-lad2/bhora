// src/auth/pages/LoginPage.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../component/auth/AuthForm';
import { loginUser } from '../../redux/Authentication/Action';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector(state => state.auth);

    const handleLogin = (userData) => {
        // Dispatch the loginUser thunk action
        dispatch(loginUser({ userData, navigate }));
    };

    return (
        <>
            <AuthForm title="Login" onSubmit={handleLogin} isRegister={false} />
            {isLoading && <p className='text-center text-blue-600'>Loading...</p>}
            {error && <p className='text-center text-red-600'>{error}</p>}
            <p className='text-center mt-4'>
                Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
            </p>
        </>
    );
};

export default LoginPage;