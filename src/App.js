import './App.css';
import React,{useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from "./component-login/Login";
import { Search } from "./component-search/Search";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login status
  return (
    <div className='bgcolor'>
      <h2 className="header">Fetch Dogs</h2>
      <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />}></Route> 
          <Route path="/search" element={<PrivateRoute isLoggedIn={isLoggedIn}> <Search />  </PrivateRoute>} />
        </Routes>
      </Router>
      </div>
      
    </div>
  );
}

export default App;


