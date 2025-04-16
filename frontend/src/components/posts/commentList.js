import Comment from "./comment";

function CommentList(comment_data) {
  return (
    <div>
      Comments
      {comment_data.data.map((output) => (
        <div key={output.id}>
          <Comment data={output} />
        </div>
      ))}
    </div>
  );
}

export default Comment;