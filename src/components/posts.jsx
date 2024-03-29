import React from "react";
import { Link } from "react-router-dom";

const Posts = (props) => {
  const { posts } = props;
  return (
    <div className="list-group">
      {posts.map((post) => (
        <Link
          className="list-group-item list-group-item-action flex-column align-items-start"
          to={'/post/${post._id}'}
          key={post._id}
        >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{post.title}</h5>
          </div>
          {post.author && (  // Check if post.author exists before accessing its properties
            <small>Created by {post.author.name}</small>
          )}
          <br />
          <small className="overflow-hidden">{post.description}</small>
          <div className="mt-1">
            Related Topics:
            {post.tags.map((tag) => (
              <span className="badge badge-secondary m-1 p-2" key={tag._id}>{tag.name}</span>
            ))}
            <h6 className="mt-2">
              {post.upvotes.length} Likes | {post.views} Views
            </h6>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
