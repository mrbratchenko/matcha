import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";

class ProfileAbout extends Component {
  render() {
    const profile = this.props.profile;
    console.log(profile);

    // Get first name
    const firstName = profile.name.trim().split(" ")[0];

    // Skill list
    const interests = profile.interests.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" /> {skill}
      </div>
    ));
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{firstName}'s Bio</h3>
            <p className="lead">
              {isEmpty(profile.bio) ? (
                <span>{firstName} does not have a bio</span>
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
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.array.isRequired
};

export default ProfileAbout;
