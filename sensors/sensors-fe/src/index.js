import ReactDOM from 'react-dom';
import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.js';
import RoomsManager from './RoomsManager.js';

export const backendRootUri = "http://localhost:8080/api";

const App = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<RoomsManager />} />
      </Routes>
    </div>
  </Router>
);

const root =  document.getElementById('root');
ReactDOM.render(<App />,root);
