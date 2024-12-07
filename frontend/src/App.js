import './App.css';
import axios from 'axios';
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Post from './components/post'
import Website from './components/website'
import { AuthProvider } from './context/auth';

function TestPost(){
  return (
    <h1> url1 </h1>
  )
}

const App = () =>{
  return (
    <div className='App'>
      <AuthProvider>
       <Website/>
      </AuthProvider>
    </div>
  );
}

export default App;
