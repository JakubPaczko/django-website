import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "./posts.css";
import { AuthContext } from "../../context/auth";

// frontend\src\context\auth.js
// frontend\src\components\post.js

function Post(post) {
  const [user_like_id, set_user_like_id] = useState(post.data.user_like_id);
  const [like_count, set_like_count] = useState(post.data.like_count);
  const { user } = useContext(AuthContext);
  let { token } = useContext(AuthContext);

  const ToggleLike = (post_id) => {
    let headers = {
      Authorization: "Bearer " + String(token ? token.access : ""),
    };
    if (user_like_id) {
      axios
        .delete(`http://127.0.0.1:8000/post_likes/${user_like_id}/`, {
          headers: headers,
        })
        .then(function (response) {
          set_user_like_id(null);
          set_like_count(like_count - 1);

          console.log(response);
        })
        .catch(function (error) {
          console.log(error.response);
        });
      return;
    }
    axios
      .post(
        "http://127.0.0.1:8000/post_likes/",
        {
          user: user ? user.user_id : null,
          post: post.data.id,
        },
        { headers: headers }
      )
      .then(function (response) {
        set_user_like_id(response.data.id);
        set_like_count(like_count + 1);

        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response);
      });
  };

  const UpdatePostLikes = (post_id) => {};

  return (
    <div id="post" style={{ overflow: "hidden" }} className="post">
      <a href="a">
        <img
          className="icon"
          style={{ float: "left", borderRadius: "50%", paddingRight: "15px" }}
          src={post.data.community.icon}
          height="32px"
        ></img>
        <div className="float_left"> {post.data.community.name} </div>
      </a>

      <div style={{ float: "right", color: "gray" }}>
        {" "}
        {post.data.pub_date}{" "}
      </div>

      <a href="a">
        <div style={{ paddingBottom: "25px", clear: "both" }}>
          {" "}
          user: &nbsp; {post.data.author.username}{" "}
        </div>
      </a>

      <h2 className="post_image">{post.data.title} </h2>

      <div>{post.data.content}</div>

      <div style={{ textAlign: "center" }}>
        <img
          src={post.data.image}
          style={{ maxWidth: "60%", margin: "0 auto" }}
        ></img>
      </div>

      <a onClick={() => ToggleLike(post.data.id)}>
        {!user_like_id ? (
          <div
            className="button unselectable"
            style={{
              marginTop: "25px",
              float: "left",
              marginRight: "10px",
              padding: "5px 10px",
              lineHeight: "25px",
            }}
          >
            <div style={{ height: "100%", float: "left", paddingRight: "5px" }}>
              <img
                src={process.env.PUBLIC_URL + "/plus-circle-svgrepo-com.svg"}
                style={{ height: "100%" }}
              ></img>
            </div>
            <div style={{ overflow: "hidden" }}> {like_count} </div>
          </div>
        ) : (
          <div
            className="button_clicked unselectable"
            style={{
              marginTop: "25px",
              float: "left",
              marginRight: "10px",
              padding: "5px 10px",
              lineHeight: "25px",
            }}
          >
            <div style={{ height: "100%", float: "left", paddingRight: "5px" }}>
              <img
                src={process.env.PUBLIC_URL + "/plus-circle-svgrepo-com.svg"}
                style={{ height: "100%" }}
              ></img>
            </div>
            <div style={{ overflow: "hidden" }}> {like_count} </div>
          </div>
        )}
      </a>

      <a href={"/post/" + post.data.id} style={{ lineHeight: "25px" }}>
        <div
          className="button"
          style={{
            marginTop: "25px",
            float: "left",
            marginRight: "10px",
            padding: "5px 10px",
            lineHeight: "25px",
          }}
        >
          <div style={{ height: "100%", float: "left" }}>
            <img
              src={process.env.PUBLIC_URL + "/comment-dots-svgrepo-com.svg"}
              style={{ height: "100%" }}
            ></img>
          </div>
          <div style={{ overflow: "hidden" }}> {post.data.comment_count}</div>
        </div>
      </a>
    </div>
  );
}

export default Post;