import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";
import noAvatar from "../../img/no-avatar.png";

class ProfileHeader extends Component {
  render() {
    const profile = this.props.profile;
    console.log(profile);
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={
                    profile && profile.avatar
                      ? require(`../../user-photos/${profile.avatar}`)
                      : noAvatar
                  }
                  alt="avatar"
                  style={{ height: "20vmin" }}
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.name}</h1>
              <p className="lead text-center">{profile.gender}</p>
              <p>
                Interested in{" "}
                {isEmpty(profile.preference) ? null : (
                  <span>{profile.preference}</span>
                )}
              </p>
              <p>
                {isEmpty(profile.social && profile.social.twitter) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.twitter}
                    // target="_blank"
                  >
                    <i className="fab fa-twitter fa-2x" />
                  </a>
                )}

                {isEmpty(profile.social && profile.social.facebook) ? null : (
                  <a className="text-white p-2" href={profile.social.facebook}>
                    <i className="fab fa-facebook fa-2x" />
                  </a>
                )}
                {isEmpty(profile.social && profile.social.instagram) ? null : (
                  <a className="text-white p-2" href={profile.social.instagram}>
                    <i className="fab fa-instagram fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
