
import axios from 'axios';
import React from 'react';
import './main.css'

function Post(post){
    return (
        <div id = "post" style={{overflow: "hidden"}} className="post">
                <a href="a">
                    <img className="icon" style={{float: 'left', borderRadius: '50%', paddingRight: '15px'}} src={post.data.community.icon} height="32px"></img>
                    <div className="float_left"> { post.data.community.name } </div>
                </a>
  
            <div style = {{float: 'right', color: 'gray'}}> {post.data.pub_date} </div>
            
            <h2 style={{marginTop: '10px', clear: 'both'}}>{post.data.title} </h2>
            
            <a href='a' style = {{color: 'gray'}}> 
              <div style={{paddingBottom: '25px'}}> user: &nbsp; {post.data.author.username} </div> 
            </a>
  
            
            <div>
                <div>
                {post.data.content}
                </div>
                <img src={post.data.image} ></img>
            </div>
  
            <a href="a">
                <div  className="button" style={{marginTop: '25px', float: 'left',  marginRight: '10px', padding: '5px 10px', lineHeight: '25px'}}>
                    <div style={{height: '100%', float: 'left', paddingRight: '5px'}}>
                        <img src={process.env.PUBLIC_URL + "/plus-circle-svgrepo-com.svg"} style={{height: '100%'}}></img>
                    </div>
                    <div style={{overflow: 'hidden'}}> {post.data.like_count} </div>
                </div>
            </a>
  
            <a href={"post/" + post.data.id} style={{lineHeight: '25px'}}>
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

function CommunityButton(community){
    return (
        <div>
            <a href='{% url "community" community.id %}' style="">
                <div className="light_gray rounded small_button" style="clear: both; margin-top: 10px"> 
                    <img src={community.data.icon} className="rounded small_image" style="float: left"></img>
                    <div style={{float: 'left', overflow: 'hidden', marginLeft: '10px'}} className="button_text" > {community.data.name} </div>
                </div>
            </a>
        </div>
    )
}


function Comment(comment){
    console.log(comment.data.user)
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

function LoadPosts(details){
    return(
        <div>
            {details.data.map((output, id) =>(
                <div>
                    <Post data={output}/>
                </div>
            ))}
        </div>
    )
}

class PostList extends React.Component{
    // class App extends React.Component{
    state = {details: [], }

    componentDidMount(){
        let data;
        axios.get('http://127.0.0.1:8000/posts/?limit=5&offset=0').then(res => {
        data = res.data.results;
        this.setState({
            details: data
        });
        }).catch(err => {})
    }

    render() {
        return(
        <div>
            <header> board </header>
            <hr></hr>
            {this.state.details.map((output, id) =>(
                // <p>{output.title}</p>
                <Post data={output}/>
            ))}
        </div>
        )
    }
}

export{
    PostList, 
    LoadPosts,
    Post,
    CommentList
};