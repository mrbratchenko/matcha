import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";

class PostFeed extends Component {
  render() {
    const { posts } = this.props;
    return (
      <div>
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <strong>Holy guacamole!</strong> You should check in on some of those
          fields below.
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    );
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostFeed;
