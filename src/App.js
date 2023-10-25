import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from "./component-login/Login";
import { Search } from "./component-search/Search";

function App() {
  return (
    <div className='bgcolor'>
      <h2 className="header">Fetch Dogs</h2>
      <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element ={<Login />} />
          <Route path="/search" element={ <Search />} />
        </Routes>
      </Router>
      </div>
    </div>
  );
}

export default App;


