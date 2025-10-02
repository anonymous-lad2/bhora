// src/components/auth/AuthForm.jsx
import React, { useState } from 'react';

const AuthForm = ({ title, onSubmit, isRegister }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        if (isRegister) {
            userData.fullName = fullName;
        }
        onSubmit(userData);
    };

    return (
        <div className='p-8 bg-white rounded-xl shadow-2xl max-w-sm mx-auto my-10'>
            <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>{title}</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className='w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500'
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500'
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500'
                    required
                />
                <button
                    type="submit"
                    className='w-full bg-blue-600 text-white font-semibold rounded-lg py-3 hover:bg-blue-700 transition duration-200'
                >
                    {title}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;