import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostForm from "./PostForm";
import PostFeed from "./PostFeed";
import { getAllPosts } from "../../actions/postActions";
import Spinner from "../common/Spinner";

class Posts extends Component {
  componentDidMount() {
    this.props.getAllPosts();
  }

  render() {
    const { posts, loading } = this.props.post;

    let postComment;

    if (posts === null || loading) {
      postComment = <Spinner />;
    } else {
      postComment = <PostFeed posts={posts} />;
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PostForm />
              {postComment}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getAllPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getAllPosts }
)(Posts);
