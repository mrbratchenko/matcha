import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;
    const firstName =
      profile && profile.name ? profile.name.trim().split(" ")[0] : "unknown";

    let interests;
    if (profile && profile.interests) {
      interests = profile.interests.map((skill, index) => (
        <div key={index} className="p-3">
          <i className="fa fa-check" /> {skill}
        </div>
      ));
    } else {
      interests = (
        <p className="lead ml-2">
          <span>{firstName} has not mentioned any interests yet.</span>
        </p>
      );
    }
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{firstName}'s Bio</h3>
            <p className="lead">
              {isEmpty(profile.bio) ? (
                <span>{firstName} does not have a bio.</span>
              ) : (
                profile.bio
              )}
            </p>
            <hr />
            <h3 className="text-center text-info">Interests</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center" />
              {interests}
            </div>
            <hr />
            <h3 className="text-center text-info">Location</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center ml-3" />
              <span>
                {profile.location ? profile.location : null}{" "}
                {profile.coordinate && profile.coordinate.length
                  ? `[${profile.coordinate[0]}, ${profile.coordinate[1]}]`
                  : null}
              </span>
            </div>
            <hr />
            <h3 className="text-center text-info">Fame Rating</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center ml-3" />
              <span>{profile.fame ? profile.fame : null}</span>
            </div>
            {this.props.extraContent}
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
