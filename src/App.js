// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './auth/pages/Login';
import RegisterPage from './auth/pages/Register';
import KanbanBoard from './pages/KanbanBoard';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Add a 404 page route here */}
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/board" element={<KanbanBoard />} />
        </Routes>
    );
}

export default App;