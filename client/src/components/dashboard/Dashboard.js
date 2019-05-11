import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";
import ProfileHeader from "../profile/ProfileHeader";
import ProfileAbout from "../profile/ProfileAbout";
import noAvatar from "../../img/no-avatar.png";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;

    if (!profile || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (profile.gender) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome{" "}
              <Link to={`/profile/${profile.username}`}>{profile.name}</Link>
            </p>
            <ProfileActions />
            <ProfileHeader profile={profile} />
            <ProfileAbout
              profile={profile}
              extraContent={
                <div>
                  <hr />
                  <h3 className="text-center text-info">You were liked by</h3>
                  <div className="row">
                    <div className="d-flex flex-wrap justify-content-center align-items-center ml-3" />
                    <div className="container">
                      <div className="row">
                        {profile && profile.likes && profile.likes.length ? (
                          profile.likes.map((like, i) => {
                            return (
                              <div className="ml-3 mr-3">
                                <div>
                                  <Link to={`/profile/${like.username}`}>
                                    <img
                                      className="rounded-circle img-thumbnail "
                                      style={{
                                        width: "70px",
                                        height: "70px"
                                      }}
                                      src={
                                        like && like.avatar
                                          ? require(`../../user-photos/${
                                              like.avatar
                                            }`)
                                          : noAvatar
                                      }
                                      alt=""
                                    />
                                  </Link>
                                </div>
                                <div>
                                  <span>
                                    {like && like.username
                                      ? like.username
                                      : null}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="lead ml-2">
                            <span>Noone liked you yet.</span>
                          </p>
                        )}
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              }
            />

            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account
            </button>
          </div>
        );
      } else {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not set up a profile, please add some info</p>
            <Link to="/edit-profile" className="btn btn-lg btn-danger">
              Create profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
