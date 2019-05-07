import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import { connect } from "react-redux";

import noAvatar from "../../img/no-avatar.png";
import { Row, Card, Col, Button } from "reactstrap";
import { addFake } from "../../actions/profileActions";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;
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
            </p>
            <Link to={`/profile/${profile.username}`} className="btn btn-info mr-2">
              View Profile
            </Link>
            <Button
                color="danger"
                onClick={() => this.props.addFake({name: profile._id})}
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
        </Row>
      </Card>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  addFake: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

export default connect(
  mapStateToProps,
  { addFake }
)(withRouter(ProfileItem));
