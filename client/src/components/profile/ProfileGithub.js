import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProfileGithub extends Component {
  state = {
    clientId: "33fa113edbdbc548aa46",
    clienSecret: "7a3d1f0e330bdfbebafa6bb3ef1730454ccd150c",
    count: 5,
    sort: "created: asc",
    repos: []
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.username === null || nextProps.username === undefined) {
  //     this.props.username = [];
  //   }
  // }

  componentDidMount() {
    let username = this.props.username;
    if (/[а-яА-ЯЁёЇї]/.test(username)) {
      username = "test";
    }
    const { clienSecret, clientId, count, sort } = this.state;
    const url = `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clienSecret}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (this.refs.myRef) {
          this.setState({ repos: data });
          console.log("data: ", data);
        }
      })
      .catch(err => console.log(err));
  }

  // onGithubClick()
  render() {
    const { repos, count } = this.state;

    const reposItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link
                to={`//${repo.html_url}`}
                className="text-info"
                target="_blank"
                onClick={e => {
                  e.preventDefault();
                  window.open(repo.html_url);
                }}
              >
                {repo.name}
              </Link>
            </h4>
            <span>{repo.html_url}</span>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">
          Latest ({repos.length >= count ? count : ""}) Github Repos
        </h3>
        {reposItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGithub;
