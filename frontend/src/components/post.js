
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import './main.css'
import { AuthContext } from '../context/auth';

function Post(post){
    const [is_liked, set_liked] = useState(false)
    const [like_count, set_like_count] = useState(0)
    let {token} = useContext(AuthContext)

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/posts/${post.data.id}/is_liked_by_user/`,
            {
                headers: {
                    Authorization : 'Bearer ' + String(token.access),
                }
            }).then(res => {
                set_liked(res.data.status);
            }).catch(err => {
                console.log(err)
            })
        set_like_count(post.data.like_count)
      }, []);

    const AddComment = () => {

    }

    const AddPostLike = (post_id) =>{
        axios.post(`http://127.0.0.1:8000/posts/${post_id}/add_post_like/`,
            { },
            {
                headers: {
                    Authorization : 'Bearer ' + String(token.access),
                }
            })
            .then(function (response) {
                if( response.data.status === 'like added'){
                    set_liked(true)
                    set_like_count(like_count+1)
                }
                else{
                    set_liked(false)
                    set_like_count(like_count-1)
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }

    const UpdatePostLikes = (post_id) => {

    }

    return (
        <div id = "post" style={{overflow: "hidden"}} className="post">
                <a href="a">
                    <img className="icon" style={{float: 'left', borderRadius: '50%', paddingRight: '15px'}} src={post.data.community.icon} height="32px"></img>
                    <div className="float_left"> { post.data.community.name } </div>
                </a>
  
            <div style = {{float: 'right', color: 'gray'}}> {post.data.pub_date} </div>
            
            
            <a href='a' style = {{color: 'gray'}}> 
              <div style={{paddingBottom: '25px', clear: 'both'}}> user: &nbsp; {post.data.author.username} </div> 
            </a>

            <h2 style={{marginTop: '10px', clear: 'both'}}>{post.data.title} </h2>

            <div>
                {post.data.content}
            </div>

            <div style={{textAlign: 'center'}}>

                <img src={post.data.image} style={{maxWidth: '60%', margin: '0 auto'}} ></img>
            </div>
  
            <a onClick={() => AddPostLike(post.data.id)}>
                { !is_liked ? 
                <div  className="button unselectable" style={{marginTop: '25px', float: 'left',  marginRight: '10px', padding: '5px 10px', lineHeight: '25px'}}>
                    <div style={{height: '100%', float: 'left', paddingRight: '5px'}}>
                        <img src={process.env.PUBLIC_URL + "/plus-circle-svgrepo-com.svg"} style={{height: '100%'}}></img>
                    </div>
                    <div style={{overflow: 'hidden'}}> {like_count} </div>
                </div>
                :
                <div  className="button_clicked unselectable" style={{marginTop: '25px', float: 'left',  marginRight: '10px', padding: '5px 10px', lineHeight: '25px'}}>
                    <div style={{height: '100%', float: 'left', paddingRight: '5px'}}>
                        <img src={process.env.PUBLIC_URL + "/plus-circle-svgrepo-com.svg"} style={{height: '100%'}}></img>
                    </div>
                    <div style={{overflow: 'hidden'}}> {like_count} </div>
                </div>
                }
            </a>
  
            <a href={"/post/" + post.data.id} style={{lineHeight: '25px'}}>
                <div className="button" style={{marginTop: '25px', float: 'left',  marginRight: '10px', padding: '5px 10px', lineHeight: '25px'}}> 
                    <div style={{height: '100%', float: 'left'}}>
                        <img src={process.env.PUBLIC_URL + "/comment-dots-svgrepo-com.svg"} style={{height: '100%'}}></img>
                    </div>
                    <div style={{overflow: 'hidden'}}> {post.data.comment_count}</div>
                </div>
            </a>
        </div>
    )
  }

function Comment(comment){
    // console.log(comment.data.user)
    return (
        <div id = "comment" style={{overflow: 'hidden'}}>
            <img src={ comment.data.user.avatar } className="small_image rounded" style={{float: 'left', marginRight: '10px'}}></img>

            <div style = {{float: 'right', color: 'gray'}}> date </div>
            
            <a href=""><h4 style={{marginTop: '0', color: 'gray'}}> user: {comment.data.user.username} </h4></a>
            {/* <h4 style="margin-top: 0; color: gray;"> user: &nbsp; [deleted] </h4> */}
            
            <div>
                {comment.data.content}
            </div>

            <a href="a">
                <div  className="button" style={{marginTop: '25px', float: 'left',  marginRight: '10px', padding: '5px 10px', lineHeight: '25px'}}>
                    <div style={{height: '100%', float: 'left', paddingRight: '5px'}}>
                        <img src={process.env.PUBLIC_URL + "/plus-circle-svgrepo-com.svg"} style={{height: '100%'}}></img>
                    </div>
                    <div style={{overflow: 'hidden'}}> 100 </div>
                </div>
            </a>
  </div>
    )
}

async function AddPostLike__(post_id = 1){
    let authTokens = JSON.parse(localStorage.getItem('authToken'))

    axios.post(`http://127.0.0.1:8000/posts/${post_id}/add_post_like/`,
        { },
        {
            headers: {
                Authorization : 'Bearer ' + String(authTokens.access),
            }
        }
    )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response);
      });
}

function CommentList(comment_data){
    return(
        <div>
            Comments
            {comment_data.data.map((output, id) =>(
                <div>
                    <Comment data={output}/>
                </div>
            ))}
    </div>
    )
}

function PostList(details){
    return(
        <div>
            {details.data.map((output, id) =>(
                <Post data={output} key = {id} />
            ))}
        </div>
    )
}


export{
    PostList,
    Post,
    CommentList,
}