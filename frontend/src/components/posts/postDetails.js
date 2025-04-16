import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "./main.css";
import { AuthContext } from "../context/auth";

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