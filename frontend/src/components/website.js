import React, { createRef, useEffect, useState } from 'react';
import './main.css'
import {PostList, LoadPosts , Post, CommentList}from './post'
import axios from 'axios';
import {Routes, Route, useParams} from 'react-router-dom'



class Board extends React.Component{
    constructor(props) {
        super(props);
        this.scrollbox = React.createRef();
      }

    state = {
        details: [],
        scroll_position : 0,
        board_offset : 0,
    };

    componentDidMount(){
        let data;
        axios.get('http://127.0.0.1:8000/posts/?limit=5&offset=0').then(res => {
        data = res.data.results;
        this.setState({
            details: data
        });
        }).catch(err => {})

        const scrollb = this.scrollbox.current
        const scroll_val = window.sessionStorage.getItem("scroll")
        // scrollb.scrollTop = scroll_val
        // scrollb.scrollTop = scroll_val;
        // console.log('scrolled')
        // scrollb.scrollTo({ top: scroll_val, behavior: 'smooth' });
        // console.log(scroll_val)
        // scrollb.scrollTop = scroll_val;
        setTimeout(() => {
            scrollb.scrollTo({ top: scroll_val, behavior: "smooth" });
            // scrollb.scrollTo(0, scroll_val); // Przewinięcie strony do zapisanej pozycji
          }, 100);
        // console.log(scrollb)
        // console.log(scrollb)

    }

    handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        this.state.scroll_position = scrollTop;
        window.sessionStorage.setItem("scroll", scrollTop)
    
        if( scrollTop >= (scrollHeight - clientHeight))
        {
            this.state.board_offset += 5;
            let data;

            axios.get('http://127.0.0.1:8000/posts/?limit=5&offset=' + this.state.board_offset).then(res => {
            data = res.data.results;
            this.setState({details: [...this.state.details, ...data]})
            })
            .catch(err => {

            })
            // console.log(this.state.details)
        }
    }

    render(){
        return(
            <div id = "board" className="scrollbox" ref={this.scrollbox} onScroll={this.handleScroll}>
                <LoadPosts data={this.state.details}/>
            </div>
        )
    }
}


function PostDetails(){
    const [details, setDetails] = useState({});
    const [comments, setComments] = useState({});
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    const { postid } = useParams();
    // let details = {};

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/posts/' + postid + '/').then(res => {
            // setDetails(res.data)
                setDetails(res.data);
                setTimeout(() => {
                    setLoading(false)
                  }, 100);

            }).catch(err => {
                setLoading(false)
            })
        axios.get('http://127.0.0.1:8000/post_comments/' + postid + '/').then(res => {
            // setDetails(res.data)
            setComments(res.data);
                setTimeout(() => {
                    setCommentsLoading(false)
                    }, 100);

            }).catch(err => {
                setCommentsLoading(false)
            })
    }, []);


    return(
        <div id = "board" className="scrollbox" >
            <a href="/">
                <div  className="button" style={{marginTop: '25px', marginRight: '10px', padding: '5px 10px', lineHeight: '25px', width: '100px'}}>
                    <div style={{height: '100%', float: 'left', paddingRight: '5px'}}>
                        <img src={process.env.PUBLIC_URL + "/arrow-sm-left-svgrepo-com.svg"} style={{height: '100%'}}></img>
                    </div>
                    <div style={{overflow: 'hidden'}}> return </div>
                </div>
            </a>
            
            {loading ? <div>loading</div> : <Post data={details}/> }
            {commentsLoading ? <div>loading comments</div> : <CommentList data={comments}/> }

        </div>
    )
}
// class CommunityList extends React.Component(){

// }

class Website extends React.Component{
    render()
    {
        return (
        <div>

            <div className="header" style= {{backgroundColor: "black", color: 'white', height: '100px'}} > 
                <div style={{height: '100%', float: 'left'}}>
                    <img src={process.env.PUBLIC_URL + "/purpledidlogo.png"} style={{float: 'left', height: '50%'}} ></img>
                    <h2 style={{float: 'left', margin: '0', lineHeight: '64px'}}>PurpleDid</h2>
                </div>

        
                <div style ={{float: 'right'}}>
                    <a href=""> logout </a>
                </div>

                
                <div style={{margin: 'auto'}}>
                    <input type='text'></input>
                </div>
            </div>

            <hr style={{margin: '0px'}}></hr>
            <div id = "container">

                <div id = "groups" className="scrollbox padding_left padding_right"> 
                    <p>
                        <a href =""> Home </a>
                    </p>
                    <p>
                        <a href =""> Popular </a>
                    </p>
                    <p>
                        <a href =""> Browse communities </a>
                    </p>
                    <p>
                        <a href =""> create community </a>
                    </p>

                    <hr style={{margin: '0px'}}></hr>

                    <p>  </p>
                </div>
        
                <div id = "friends" className="scrollbox"> 

                </div>

                <div id = "boardheader">


                </div>
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="/post/:postid" element={<PostDetails />} />

                </Routes>

            </div>
        </div>
        )
    }
}

export default Website;