import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Match.css";

const baseURL = "https://frontend-take-home-service.fetch.com";
export const Match = (props) => {
    const [yourDog, setYourDog] = useState();
    const [location, setLocation] = useState();

    useEffect(() =>{
        axios.defaults.withCredentials=true;
        axios.post(`${baseURL}/dogs`, [`${props.match}`], {
            withCredentials: true, // This will include cookies
        })
        .then((response) => {
            setYourDog(response.data);
        })
        .catch((error) => {
            console.error("Dog Details Request Error:", error);
        });

    }, [props.match]);

    useEffect(() =>{
        //location Api
        if(yourDog && yourDog[0] && yourDog[0].zip_code){
            axios.post(`${baseURL}/locations`, [yourDog[0].zip_code], {
                withCredentials: true,
            })
            .then((response) => {
                setLocation(response.data);
            })
            .catch((error) => {
                console.error("Location details request Error:", error);
            })
        }

    }, [yourDog])

    return (
        <>
        <div className="MatchBox">
        <h2>Your match</h2>
        <img className="Img" src={yourDog ? yourDog[0].img : ''} alt="Dog Image" />
        
        <table className="DetailsTable">
        <tbody>
            <tr>
                <td>Name</td>
                <td>{yourDog ? yourDog[0].name : 'Loading...'}</td>
            </tr>
            <tr>
                <td>Breed</td>
                <td>{yourDog ? yourDog[0].breed : 'Loading...'}</td>
            </tr>
            <tr>
                <td>Age</td>
                <td>{yourDog ? yourDog[0].age : 'Loading...'}</td>
            </tr>
            <tr>
                <td>City</td>
                <td>{location ? location[0].city : 'Loading...'}</td>
            </tr>
            <tr>
                <td>County</td>
                <td>{location ? location[0].county : 'Loading...'}</td>
            </tr>
            <tr>
                <td>State</td>
                <td>{location ? location[0].state : 'Loading...'}</td>
            </tr>
            <tr>
                <td>Zip Code</td>
                <td>{yourDog ? yourDog[0].zip_code : 'Loading...'}</td>
            </tr>
            <tr>
                <td>Longitude</td>
                <td>{location ? location[0].longitude : 'Loading...'}</td>
            </tr>
            <tr>
                <td>Latitude</td>
                <td>{location ? location[0].latitude : 'Loading...'}</td>
            </tr>
        </tbody>
        </table>

        </div>
        </>
    )
}