import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"

const baseURL = "https://frontend-take-home-service.fetch.com";

export const Login = () =>{
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Initialize useHistory
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post(`${baseURL}/auth/login`, {
            name: username,
            email: email
        }, {
            withCredentials: true,
        })
        .then((response) =>{
            if (response.status === 200) {
                //setIsLoggedIn(true); // Set the login status to true
                navigate('/search'); 
            }
        })
        .catch((error) => {
            console.error("Login Error:", error);
        });
    }
    return (
        <>
        <div className="Login">
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input value = {username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="username" id="username" name="username"></input>
            <label htmlFor="email">Email</label>
            <input value = {email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="yourmail@gmail.com" id="email" name="email"></input>
            <button type="submit">Log In</button>
        </form>
        </div>
        </>
    )
}