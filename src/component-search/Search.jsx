import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Search.css"
import { Match } from "../component-match/Match"
import { Logout } from "../component-logout/Logout"
import Uparrow from "../imgs/arrow-up-solid.svg"
import Downarrow from "../imgs/arrow-down-solid.svg"
import { useNavigate } from "react-router-dom";

const baseURL = "https://frontend-take-home-service.fetch.com";

export const Search = () =>{
    const [breeds, setBreeds] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]); // Store the selected breed
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [resultsPerPage] = useState(25); // Number of results per page
    const [dogDetails, setDogDetails] = useState([]); // searching for /dogs
    const [endPage, setEndPage] =useState(1); //to check if reached end of the search results
    const [favDogs, setFavDogs] = useState([]); //add favourate dogs
    const [matchedDog, setMatchedDog] = useState(); //add the matched dog here 
    const [sortingOrder, setSortingOrder] = useState("breed:asc");
    const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of dog breeds when the component mounts
    axios.get(`${baseURL}/dogs/breeds`, {
        withCredentials: true,
    })
      .then((response) => {
        setBreeds(response.data);
      })
      .catch((error) => {
        if(error.response.status === 401){
          navigate("/");
        }
        console.error("GET Request Error1:", error);
      });
  }, []);

  //this useEffect calls handleSearch once the page loads up so, it displays all the list of breed dogs
      useEffect(() => {
        handleSearch();
    }, [currentPage, sortingOrder]);

    //handle multiple breeds selected array
    const handleBreadSelection = (e) => {
      let selected = Array.from(e.target.selectedOptions, option => option.value);
      setSelectedBreeds(selected);
    }
    //search breeds function
    const searchBreeds = (e) => {
      e.preventDefault();
      if(currentPage === 1){
        handleSearch();
      }else{
        setCurrentPage(1);
      }
    }

    const handleSearch = () =>{
        axios.defaults.withCredentials=true; 
        // Prepare the query parameters
        const queryParams = {
            ...selectedBreeds.length>0?{breeds: selectedBreeds, sort: sortingOrder}:{sort: sortingOrder},  //spread operator to check if the breeds are selected
            // results of the paginated
            size: resultsPerPage,
            from: (currentPage - 1) * resultsPerPage,
        };

        axios.get(`${baseURL}/dogs/search`, {
            params: queryParams,
        },
         {
            withCredentials: true, // This will include cookies
        })
        .then((response) => {
            // Fetch dog details for the current page
            fetchDogDetails(response.data.resultIds);
        })
        .catch((error) => {
            if(error.response.status === 401){ //if the response is unauthorized
              navigate("/");
            }
            console.error("Search Request Error:", error);
        });
    }

    // Function to fetch dog details
    const fetchDogDetails = (dogIds) => {
        axios.defaults.withCredentials=true;
        if (dogIds.length > 0) {
            axios.post(`${baseURL}/dogs`, dogIds.slice(0, 100), {
                withCredentials: true, // This will include cookies
            })
            .then((response) => {
                setDogDetails(response.data);
            })
            .catch((error) => {
                if(error.response.status === 401){
                    navigate("/");
                }
                console.error("Dog Details Request Error:", error);
            });
            setEndPage(1);
        }
        if(dogIds.length< resultsPerPage){
            setEndPage(0);
        }
    }

    // Handle pagination
    const nextPage = (e) => {
        e.preventDefault();
        setCurrentPage(currentPage+1);
    };

    const prevPage = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    //check favorites
    const checkFav = (id) =>{
        return (favDogs.some(element => id == element));
    }

    //favorites dogs list function
    const addToFavorites = (id, checked) =>{
        if (checked) {
            // Add the ID to the favorites list
            setFavDogs((currFavDogs) => [...currFavDogs, id]);
          } else {
            // Remove the ID from the favorites list
            setFavDogs((currFavDogs) => currFavDogs.filter((dogId) => dogId !== id));
          }
    }

    //find the matched dog
    const findMatch = () => {
      axios.defaults.withCredentials=true;
      if(favDogs.length > 0){
        axios.post(`${baseURL}/dogs/match`, favDogs, {
          withCredentials: true, // This will include cookies
        })
        .then((response) => {
          setMatchedDog(response.data);
        })
        .catch((error) => {
          if(error.response.status === 401){
              navigate("/");
          }
          console.error("Dog matched Details Request Error:", error);
        });

      }else{
        alert("Please select atleast one dog!")
      }
    }

    //clear the matchedDog property
    const clear = () =>{
      setMatchedDog(null);
    }

    const clearChecked = () =>{
      setFavDogs([]);
    }

    const sort = () =>{
      if(sortingOrder === "breed:asc"){
        setSortingOrder("breed:desc");
      }else{
        setSortingOrder("breed:asc");
      }
      
    }

    if(matchedDog){
      return (
        <>
        <Logout />
        <Match match={matchedDog.match} /> {/*//props objects*/}
        <button onClick={clear} className="top-left-button">{"<<"} Go back</button>
        </>
      )
    }else{
      return (
        <>
        <div>
          <Logout />
        <form onSubmit={searchBreeds} className="Form-submit">
          <label htmlFor="breed">Select your Breeds: </label>
          <select multiple={true}
            id="breed"
            value={selectedBreeds}
            onChange={(e) => handleBreadSelection(e)}>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
          <button type="submit">Search</button>
        </form>
        <button className="FindMatch" onClick={findMatch}>Find your match</button> {/*find the match function */}
        <ul className="Fontstyle">
          <li>Please select your favorite dogs from the table below. Use the 'Next' and 'Previous' 
              buttons below the table to navigate to other pages.</li>
          <li>After selecting your favorite dogs, 
        click the <span>'Find your match'</span> button above to view your matched dog and its details.</li>
        <li>Favorites will persist across breed searches, to uncheck favorites click here {`->`} &nbsp;
        <button className="unckeckbutton" onClick={clearChecked}>Uncheck All</button>
        </li>
        </ul>
        
        <table className="Table">
              
            <thead>
                <tr>
                <th>Favorites</th> {/* Clear the checked list */}
                {/*<th>Dog ID</th> */}
                <th>Name</th>
                <th className="breedbutton" onClick={sort}>
                  Breed 
                    {sortingOrder === "breed:asc" ? <img className="arrow" src={Uparrow}/> : <img className="arrow" src={Downarrow}/>}
                </th>
                <th>Age</th>
                <th>Zip Code</th>
                <th className="tableheader2">Image</th>
                </tr>
            </thead>
            <tbody>
                {dogDetails.map((dog) => (
                <tr key={dog.id}>
                    <td><input type="checkbox" 
                        checked={checkFav(dog.id)} 
                        onChange={(e) => addToFavorites(dog.id, e.target.checked)}/>  {/* passing the checked and unchecked id's to the function*/}
                    </td>
                    {/*<td>{dog.id}</td>*/}
                    <td>{dog.name}</td>
                    <td>{dog.breed}</td>
                    <td>{dog.age}</td>
                    <td>{dog.zip_code}</td>
                    <td>
                    <img className="Img" src={dog.img} alt={`${dog.name}'s Image`} />
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
       
        <div className="pagination">
          {(currentPage-1) > 0 &&(
            <button onClick={prevPage}>Previous</button>
          )}  
          <span>Page {currentPage}</span>
          { (endPage > 0) && (
            <button onClick={nextPage}>Next</button>
          )}
        </div>
      </div>
        </>

      )
    }

}