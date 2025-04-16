import Post from "./post";

function PostList(details) {
    // console.log(details.data);
    return (
      <div>
        {details.data ? (
          details.data.map((output, id) => <Post data={output} key={id} />)
        ) : (
          <div> no posts</div>
        )}
      </div>
    );
  }

export {PostList}