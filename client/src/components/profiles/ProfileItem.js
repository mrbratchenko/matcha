import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import { connect } from "react-redux";

import noAvatar from "../../img/no-avatar.png";
import { Row, Card, Col, Button } from "reactstrap";
import {
  addFake,
  addProfileLike,
  removeProfileLike
} from "../../actions/profileActions";
import classnames from "classnames";

class ProfileItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      profileId: null
    };
  }

  onLikeClick(id) {
    this.props.addProfileLike(id);
  }

  onUnlikeClick(id) {
    this.props.removeProfileLike(id);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes && likes.filter(like => like.user === auth.user.id).length) {
      return true;
    } else {
      return false;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.errors).length) {
      this.setState({
        errors: nextProps.errors,
        profileId: nextProps.profileId
      });
    }
  }

  render() {
    const { profile, showActions } = this.props;

    return (
      <Card className="card-body bg-light mb-3">
        <Row>
          <Col className="mb-3">
            <img
              src={
                profile.avatar
                  ? require(`../../user-photos/${profile.avatar}`)
                  : noAvatar
              }
              alt={noAvatar}
              className="rounded-circle mt-4"
              style={{ height: "12vmin" }}
            />
            {showActions ? (
              <span className="mt-4 ml-4">
                <button
                  onClick={this.onLikeClick.bind(this, profile._id)}
                  type="button"
                  className="btn btn-light mr-1 mt-2"
                >
                  <i
                    className={classnames("fas fa-heart", {
                      "text-danger": this.findUserLike(profile.likes)
                    })}
                  />

                  <span className="badge badge-light">
                    {profile.likes ? profile.likes.length : null}
                  </span>
                </button>
                <button
                  onClick={this.onUnlikeClick.bind(this, profile._id)}
                  type="button"
                  className="btn btn-light mr-1 mt-2"
                >
                  <i className="fas fa-heart-broken" />
                </button>
              </span>
            ) : null}
          </Col>

          <Col className="col-lg-6 col-md-4 col-8">
            <h3>{profile.name}</h3>
            <p>
              {profile.gender}
              {isEmpty(profile.age) ? null : <span>, age {profile.age}</span>}
            </p>
            <p>
              {isEmpty(profile.location) ? null : (
                <span>In {profile.location}</span>
              )}
              {profile.coordinate && profile.coordinate.length
                ? ` [${profile.coordinate[0]}, ${profile.coordinate[1]}]`
                : null}
            </p>
            <p>
              {isEmpty(profile.fame) ? null : <span>Fame: {profile.fame}</span>}
            </p>
            <Link
              to={`/profile/${profile.username}`}
              className="btn btn-info mr-2"
            >
              View Profile
            </Link>
            <Button
              color="danger"
              onClick={() => this.props.addFake({ name: profile._id })}
            >
              Fake Profile
            </Button>
          </Col>
          <Col className="col-md-4 d-none d-md-block">
            <h4>Interests</h4>
            <ul className="list-group">
              {profile.interests &&
                profile.interests.slice(0, 4).map((skill, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fa fa-check pr-1" />
                    {skill}
                  </li>
                ))}
            </ul>
          </Col>

          {this.state.errors.alreadyliked &&
          this.state.errors.profileId === profile._id ? (
            <div class="alert alert-danger ml-4" role="alert">
              {this.state.errors.alreadyliked}
            </div>
          ) : null}
          {this.state.errors.notliked &&
          this.state.errors.profileId === profile._id ? (
            <div class="alert alert-danger ml-4" role="alert">
              {this.state.errors.notliked}
            </div>
          ) : null}
          {this.state.errors.alreadyfaked &&
          this.state.errors.profileId === profile._id ? (
            <div class="alert alert-danger ml-4" role="alert">
              {this.state.errors.alreadyfaked}
            </div>
          ) : null}
          {this.state.errors.faked &&
          this.state.errors.profileId === profile._id ? (
            <div class="alert alert-success ml-4" role="alert">
              {this.state.errors.faked}
            </div>
          ) : null}
        </Row>
      </Card>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  addFake: PropTypes.func.isRequired,
  addProfileLike: PropTypes.func.isRequired,
  removeProfileLike: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

ProfileItem.defaultProps = {
  showActions: true
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addFake, addProfileLike, removeProfileLike }
)(withRouter(ProfileItem));
