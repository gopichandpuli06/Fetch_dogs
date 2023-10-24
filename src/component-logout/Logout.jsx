import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css"

const baseURL = "https://frontend-take-home-service.fetch.com";

export const Logout = () => {
    const navigate = useNavigate();
    
    const logoutbutton =() =>{
        axios.post(`${baseURL}/auth/logout`)
        .then((response) => {
            if(response.status === 200){
                navigate("/");
            }
          })
          .catch((error) => {
            if(error.response.status === 401){
                navigate("/");
            }
            console.error("GET Request Error1:", error);
          });
    }

    return(
        <>
        <button onClick={logoutbutton} className="logoutbutton">Logout</button>
        </>
    )
}