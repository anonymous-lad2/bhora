// src/auth/pages/RegisterPage.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../component/auth/AuthForm';
import { registerUser } from '../../redux/Authentication/Action'; // Import your thunk

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector(state => state.auth);

    const handleRegister = (userData) => {
        // Dispatch the registerUser thunk action
        dispatch(registerUser({ userData, navigate }));
    };

    return (
        <>
            <AuthForm title="Register" onSubmit={handleRegister} isRegister={true} />
            {isLoading && <p className='text-center text-blue-600'>Loading...</p>}
            {error && <p className='text-center text-red-600'>{error}</p>}
            <p className='text-center mt-4'>
                Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
            </p>
        </>
    );
};

export default RegisterPage;