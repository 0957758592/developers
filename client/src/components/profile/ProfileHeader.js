import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";
import PropTypes from "prop-types";

class ProfileHeader extends Component {
  onOpenClick(link) {
    window.open(link, "_blank");
  }
  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt={profile.user.name}
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">
                {profile.status}{" "}
                {isEmpty(profile.company) ? null : (
                  <span> at {profile.company}</span>
                )}
              </p>
              <p>
                {isEmpty(profile.location) ? null : (
                  <span>{profile.location}</span>
                )}
              </p>
              {isEmpty(profile.website) ? null : (
                <button
                  type="button"
                  onClick={this.onOpenClick.bind(this, profile.website)}
                  className="text-white p-2 btn btn-link nav-link d-inline-block"
                >
                  <i className="fas fa-globe fa-2x" />
                </button>
              )}
              {isEmpty(profile.social)
                ? null
                : Object.entries(profile.social).map(([link, value]) => (
                    <button
                      key={link}
                      type="button"
                      onClick={this.onOpenClick.bind(this, value.toString())}
                      className="text-white p-2 btn btn-link nav-link d-inline-block"
                    >
                      <i className={`fab fa-${link} fa-2x`} />
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileHeader;
