import React, { createRef, useEffect, useState, useContext } from 'react';
import './main.css'
import {PostList, Post, CommentList}from './post'
import { CommunityList } from './community';
import axios from 'axios';
import {Routes, Route, useParams, Form, Link, Links, Navigate} from 'react-router-dom'
import {AuthContext} from '../context/auth';



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

        setTimeout(() => {
            scrollb.scrollTo({ top: scroll_val, behavior: "smooth" });
          }, 100);
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
        }
    }

    render(){
        return(
            <div id = "board" className="scrollbox" ref={this.scrollbox} onScroll={this.handleScroll}>
                <PostList data={this.state.details}/>
            </div>
        )
    }
}

function CommunityBoard(){
    const [posts, setPosts] = useState({});
    const [loadingPosts, setLoadingPosts] = useState(true);
    const {communityid} = useParams();
    const [nextPosts] = useState('');

    useEffect(() => {
        setLoadingPosts(true)

        axios.get('http://127.0.0.1:8000/community_posts/' + communityid +'/?limit=5').then(res => {

                setPosts(res.data.results);
                
                nextPosts = res.data.next;
                console.log(nextPosts);

                setLoadingPosts(false)

            }).catch(err => {
                setLoadingPosts(false)
            })
    }, [communityid]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if( scrollTop === (scrollHeight - clientHeight)) {
            let data;
            if (nextPosts == '') return;
            
            axios.get(nextPosts).then(res => {
                data = res.data.results;
                nextPosts = res.data.next;
                setPosts({details: [...posts, ...data]})

            })
            .catch(err => {

            })
        }
    }

    return(
        <div id = "board" className="scrollbox" onScroll={ handleScroll }>
            {loadingPosts ? <div> loading </div> : <PostList data={posts}/>}
        </div>
    )
}

function LoginPage(){
    let {loginUser} = useContext(AuthContext)
    let {user} = useContext(AuthContext)

    // let  loginUser = useContext(AuthContext);

    return (
        <div id='board' style={{textAlign: 'center'}}>
            <h1> Login </h1>
            {user ?
            <Navigate to='/'/> :
            <form onSubmit={loginUser}>
                <p>
                    <input type='text' name='username' placeholder='Enter username'/>
                </p>
                <p>
                    <input type='password' name='password' placeholder='Enter password'/>
                </p>
                <p>
                    <input type='submit'/>
                </p>
            </form>
            }
        </div>
    )
}

class Communities extends React.Component{
    state = {
        details : [],
        is_loading : true,
    };
    componentDidMount(){
        let data;
        axios.get('http://127.0.0.1:8000/communitys/').then(res => {
        data = res.data;
        this.setState( { details: data } );
        this.setState( {is_loading: false} )
        }).catch(err => {

        })

    }

    render(){
        console.log(this.state.details)
        return(
            <div>
                {
                    this.state.is_loading ? <div> loading </div> : <CommunityList data={this.state.details}/>
                }
            </div>
        )
    }
}

function PostDetails(){
    const [details, setDetails] = useState({});
    const [comments, setComments] = useState({});
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsOffset, setCommentsOffset] = useState(5);
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

    function LoadMoreComments(){

    }


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
            <button > load more comments</button>

        </div>
    )
}
// class CommunityList extends React.Component(){

// }

function Website(){
    let {user, logoutUser} = useContext(AuthContext)

    return (
    <div>

        <div className="header" style= {{backgroundColor: "black", color: 'white', height: '100px'}} > 
            <div style={{height: '100%', float: 'left'}}>
                <img src={process.env.PUBLIC_URL + "/purpledidlogo.png"} style={{float: 'left', height: '50%'}} ></img>
                <h2 style={{float: 'left', margin: '0', lineHeight: '64px'}}>PurpleDid</h2>
            </div>

    
            <div style ={{float: 'right'}}>
                {user ? <a onClick={logoutUser}>logout</a> : <Link to='/login'>login</Link> }
                {/* <a href=""> logout </a> */}
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

                <Communities/>

            </div>
    
            <div id = "friends" className="scrollbox"> 

            </div>

            <div id = "boardheader">


            </div>
            <Routes>
                <Route path="/" element={<Board />} />
                <Route path="/post/:postid" element={<PostDetails />} />
                <Route path="/community/:communityid" element={<CommunityBoard />} />
                <Route path="/login" element={<LoginPage />} />

            </Routes>

        </div>
    </div>
    )
}

export default Website;