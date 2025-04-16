import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "./main.css";
import { AuthContext } from "../context/auth";

function Comment(comment) {
  const [user, setUser] = useState({});
  const [is_liked, set_liked] = useState(false);
  const [like_count, set_like_count] = useState(0);
  let { token } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/users/${comment.data.user}/`, {})
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const AddCommentLike = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://127.0.0.1:8000/comments/${comment.data.id}/add_like/`,
        {},
        {
          headers: {
            Authorization: "Bearer " + String(token ? token.access : ""),
          },
        }
      )
      .then(function (response) {
        if (response.data.status === "like added") {
          set_liked(true);
          set_like_count(like_count + 1);
        } else {
          set_liked(false);
          set_like_count(like_count - 1);
        }
        console.log(response);
      })
      .catch(function (error) {
        console.log(comment.data.id);
        console.log(error.response);
      });
  };

  return (
    <div id="comment" style={{ overflow: "hidden" }}>
      <img
        src={user.avatar}
        className="small_image rounded"
        style={{ float: "left", marginRight: "10px" }}
      ></img>

      <div style={{ float: "right", color: "gray" }}> {comment.data.date} </div>

      <a href="">
        <h4 style={{ marginTop: "0", color: "gray" }}>
          {" "}
          user: {user.username}{" "}
        </h4>
      </a>
      {/* <h4 style="margin-top: 0; color: gray;"> user: &nbsp; [deleted] </h4> */}

      <div>{comment.data.content}</div>

      <a onClick={AddCommentLike}>
        {!is_liked ? (
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
    </div>
  );
}

export default Comment;
