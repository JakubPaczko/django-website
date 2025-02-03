import React, {useRef, createRef, useEffect, useState, useContext } from 'react';
import './main.css'
import {PostList, Post, CommentList}from './post'
import { CommunityList } from './community';
import axios from 'axios';
import {Routes, Route, useParams, Form, Link, Links, Navigate} from 'react-router-dom'
import {AuthContext, AuthProvider} from '../context/auth';



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
    const [communityDetails, setCommunityDetails] = useState({})

    useEffect(() => {
        setLoadingPosts(true)

        axios.get('http://127.0.0.1:8000//posts/?author=&pub_date__lte=&pub_date__gte=&title__icontains=&community=' + communityid + '&?limit=5').then(res => {
                setPosts(res.data);
                
                nextPosts = res.data.next;
                // console.log(nextPosts);

                setLoadingPosts(false)

            }).catch(err => {
                console.log(err)
                setLoadingPosts(false)
            })

        axios.get('http://127.0.0.1:8000//communitys/' + communityid + '/').then(res => {
                setCommunityDetails(res.data)
            }).catch(err => {
                console.log(err)
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
                console.log(err)
            })
        }
    }

    return(
        <div style={{color:'white'}}>
            <div id = "board" className="scrollbox" onScroll={ handleScroll }>
                {communityDetails ? 
                <div>
                    <img src={communityDetails.icon} style={{borderRadius: '50%', width : '256px', height : '256px'}}></img> 
                    <h1>@{communityDetails.name}</h1> 
                    <div>{communityDetails.description}</div>
                    <a href=''>join</a>
                </div>
                :
                <h1>loading</h1>
                }
                {loadingPosts ? <div> loading </div> : <PostList data={posts}/>}
            </div>
        </div>
    )
}

function AddPost(){
    const imageRef = useRef()
    const titleRef = useRef()
    const contentRef = useRef()
    const communityRef = useRef()
    const [userCommunities, setUserCommunities] = useState([])
    const {user, token} = useContext(AuthContext)


    useEffect(()=>{
        axios.get('http://localhost:8000/communitys/?users=' + user.user_id).then(res => {
                setUserCommunities(res.data)
            }).catch(err => {
                console.log(err)
            })
    },[])

    const addPost = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/posts/',{ 
            title : titleRef.current.value,
            content : contentRef.current.value,
            author : user.user_id,
            community : communityRef.current.value,
            image : imageRef.current.files[0],
        },
        {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': 'multipart/form-data;',
                // Authorization : 'Bearer ' + String(token ? token.access : ''),
            }
        })
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
            console.error(error.response);
            // setError(error.response.data.content[0])
        });
    }

    return(
        <div id='board' style={{textAlign: 'center'}}>
            {/* <Navigate to='/'/> : */}
            {user ?
            
            <form onSubmit={addPost}>
                <p>
                    <input ref={titleRef} type='text' name='title' placeholder='Post title'/>
                </p>
                <p>
                    <textarea ref={contentRef} name='content' cols="50" rows="10" placeholder='Description'/>
                </p>
                <p>
                    <input ref={imageRef} type='file' name='image' placeholder='select image'/>
                </p>
                
                <select name="community" ref={communityRef}>
                    {userCommunities?.map((output) =>(
                            <option key={output.id} value={output.id}>{output.name}</option>
                        ))}
                </select>

                <p>
                    <input type='submit' value='Create community'/>
                </p>
            </form> 
            :
            <Navigate to='/'/> 
            }
        </div>
    )
}

function AddCommunity(){
    let {user} = useContext(AuthContext)
    const descriptionRef = useRef();
    const nameRef = useRef();
    const iconRef = useRef();

    const addCommunity = async (e) =>{
        e.preventDefault()
        // console.log(iconRef.current.files[0])
        axios.post('http://127.0.0.1:8000/communitys/', {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            icon: iconRef.current.files[0],
            admin: user.user_id,
          }, 
          {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': 'multipart/form-data;',
            }
          }
        ).then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (

        <div id='board' style={{textAlign: 'center'}}>
            <h1> Create community </h1>
            {/* <Navigate to='/'/> : */}
            {user ?
            
            <form onSubmit={addCommunity}>
                <p>
                    <input ref={nameRef} type='text' name='name' placeholder='Enter community name'/>
                </p>
                <p>
                    <textarea ref={descriptionRef} name='description' cols="50" rows="10" placeholder='Description'/>
                </p>
                <p>
                    <input ref={iconRef} type='file' name='image' placeholder='select image'/>
                </p>
                <p>
                    <input type='submit' value='Create community'/>
                </p>
            </form> 
            :
            <Navigate to='/'/> 
            }

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
            <div>dont have account yet? <a href='/register'> register</a></div>
        </div>
    )
}

function Register(){
    let {user} = useContext(AuthContext)

    const profilePictureRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();

    const registerUser = (e) =>{
        e.preventDefault()
        console.log(usernameRef.value)
        console.log(passwordRef.value)

        axios.post('http://127.0.0.1:8000/users/', {
            username : usernameRef.current.value,
            password : passwordRef.current.value,
            email : emailRef.current.value,
            avatar : profilePictureRef.current.files[0],
          }, 
          {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': 'multipart/form-data;',
            }
          }
        ).then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
        <div id='board' style={{textAlign: 'center'}}>
            <h1> Login </h1>
            {user ?
            <Navigate to='/'/> :
            <form onSubmit={registerUser}>
                <p>
                    <input ref={usernameRef} type='text' name='username' placeholder='Enter username'/>
                </p>
                <p>
                    <input ref={emailRef} type='text' name='email' placeholder='Enter email'/>
                </p>
                <p>
                    <input ref={profilePictureRef} type='file' name='profilePicture' placeholder='select picture'/>
                </p>
                <p>
                    <input ref={passwordRef} type='password' name='password' placeholder='Enter password'/>
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
        // console.log(this.state.details)
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
    const [loading, setLoading] = useState(true);
    const { post_id } = useParams();
    const {user} = useContext(AuthContext)
    const {token} = useContext(AuthContext)
    const [commentText, setCommentText] = useState('')
    const [error, setError] = useState('')

    // let details = {};

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/posts/' + post_id + '/').then(res => {
                setDetails(res.data);
                setTimeout(() => {
                    setLoading(false);
                  }, 100);

            }).catch(err => {
                setLoading(false);
            })
        axios.get('http://127.0.0.1:8000/comments/?post=' + post_id).then(res => {
            setComments(res.data);
                setTimeout(() => {
                    setCommentsLoading(false);
                    }, 0);

            }).catch(err => {
                setCommentsLoading(false);
            })
    }, []);

    const ReloadComments = () => {
        axios.get('http://127.0.0.1:8000/comments/?post=' + post_id).then(res => {
                setComments(res.data);
            }).catch(err => {
                console.error(err)
            })
        console.log(comments)
    }

    const SetCommentText = (e) => {
        setCommentText(e.target.value)
        console.log(commentText)
    }

    const AddComment = (e) =>{
        e.preventDefault()
        axios.post(`http://127.0.0.1:8000/comments/`,
            { 
                content : commentText,
                post : post_id,
                user : user.user_id
            },
            {
                headers: {
                    Authorization : 'Bearer ' + String(token ? token.access : ''),
                }
            })
            .then(function (response) {
                console.log(response)
                ReloadComments();
            })
            .catch(function (error) {
                console.error(error.response);
                setError(error.response.data.content[0])
            });
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

            <div id = "comment" style={{overflow: 'hidden'}}>
                { user ?
                <div>
                    <h3 >Add comment</h3>
                    
                    <div style={{textAlign: 'center', width: '100%'}}>
                        <textarea onChange={SetCommentText} className='rounded' name="content" rows="4" style={{width: '100%', resize: 'none', display: 'block', boxSizing: 'border-box'}}> </textarea>
                    </div>
                    <p style={{color: 'red'}}>{error}</p>
                    
                        <a onClick={AddComment} href=''>
                            <div  className="button" style={{marginTop: '25px', float: 'left',  marginRight: '10px', padding: '5px 10px', lineHeight: '25px'}}>
                                <div style={{overflow: 'hidden'}}> add comment </div>
                            {/* <h3 >Add comment</h3> */}
                            </div>
                        </a>
                </div>
                : <div> <a>Log in</a> to add comment </div>}
            </div>
            
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
                {user ? 
                    <div> 
                        <a href='/createPost'> create </a>
                        <a onClick={logoutUser}>logout</a> 
                    </div> : 
                    <div>
                        <Link to='/login'>login</Link> 
                    </div>
                }
                
            </div>

            
            <div style={{margin: 'auto'}}>
                <input type='text'></input>
            </div>
        </div>

        <hr style={{margin: '0px'}}></hr>
        <div id = "container">

            <div id = "groups" className="scrollbox padding_left padding_right"> 
                <p>
                    <a href ="/"> Home </a>
                </p>
                <p>
                    <a href =""> Popular </a>
                </p>
                <p>
                    <a href =""> Browse communities </a>
                </p>
                <p>
                    <a href ="/addCommunity"> create community </a>
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
                <Route path="/post/:post_id" element={<PostDetails />} />
                <Route path="/community/:communityid" element={<CommunityBoard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/addCommunity" element={<AddCommunity />} />
                <Route path="/createPost" element={<AddPost />} />
            </Routes>

        </div>
    </div>
    )
}

export default Website;