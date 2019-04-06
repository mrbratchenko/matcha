import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getProfiles } from "../../actions/profileActions";
import ProfileItem from "./ProfileItem";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Dating Profiles</h1>
              <p className="lead text-center">Browse and connect</p>
              <div className="sorting container card card-body bg-light mb-3">
                <h4 className="row pl-3">Sort by:</h4>
                <div className="row list-group p-3 ">
                  <div className="list-group-item">
                    Age gap
                    <input placeholder="from" name="" value="" />
                  </div>
                  <div className="form-group">
                    <input
                      type="range"
                      className="custom-range"
                      min="0"
                      max="5"
                      step="0.5"
                    />
                    <input
                      type="range"
                      className="custom-range"
                      min="0"
                      max="5"
                      step="0.5"
                    />
                  </div>
                  <div className="list-group-item">Fame rating</div>
                  <div className="list-group-item">Location</div>
                  <div className="list-group-item">Interests</div>
                </div>
              </div>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
  // state.profile is a reducer from index.js  - combineReducers
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
// Connect connects react with redux
