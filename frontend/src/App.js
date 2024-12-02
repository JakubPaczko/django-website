import './App.css';
import axios from 'axios';
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Post from './components/post'
import Website from './components/website'

function TestPost(){
  return (
    <h1> url1 </h1>
  )
}

const App = () =>{
  return (
    <div>

       <Website/>
    </div>
  );
}

// class App extends React.Component{
//   state = {details: [], }

//   componentDidMount(){
//     let data;
//     axios.get('http://127.0.0.1:8000/posts/').then(res => {
//       data = res.data;
//       this.setState({
//         details: data
//       });
//     }).catch(err => {})
//   }

//   render() {
//     return(
//       <div>
//         <header> Data Gen</header>
//         <hr></hr>
//         {this.state.details.map((output, id) =>(
//           // <p>{output.title}</p>
//           <Post data={output} post_id={id}/>
//         ))}
//       </div>
//     )
//   }
// }

export default App;
