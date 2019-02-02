import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  uploadPhoto,
  getCurrentProfile,
  deletePhoto
} from "../../actions/profileActions";
import Photo from "../common/Photo";
import classnames from "classnames";
import Spinner from "../common/Spinner";
import noPicture from "../../img/empty-photo.jpg";

const images = require.context("../../user-photos", false);

class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      file: null
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount - done!");
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps - done!");

    if (Object.keys(nextProps.errors).length) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange(e) {
    // console.log("onChange");

    e.preventDefault();

    this.setState({ file: e.target.files[0] }, () => {
      const { user } = this.props.auth;
      const photoData = new FormData();
      photoData.append("user", user.id);
      photoData.append("userPhoto", this.state.file);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      this.props.uploadPhoto(photoData, config);
    });
  }

  onDeleteClick(fileName) {
    // console.log(fileName);
    this.props.deletePhoto(fileName);
  }

  checkFile(photos) {
    photos.map(photo => {
      try {
        images("./" + photo);
      } catch (e) {
        if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
          return false;
        }
      }
    });
    return true;
  }

  render() {
    const { errors } = this.state;

    const { profile, loading } = this.props.profile;

    // console.log(images);
    let photoContent;

    if (profile === null || loading) {
      photoContent = <Spinner />;
      // } else if (!this.checkFile(profile.photos)) {
      //   console.log("failed");
      //   photoContent = <Spinner />;
    } else {
      if (profile.photos && profile.photos.length > 0) {
        photoContent = (
          <div className="row pt-md-5">
            {profile.photos.map(photo => (
              <Photo
                key={photo}
                source={photo}
                alt="profile_image"
                onDeleteClick={this.onDeleteClick.bind(this, photo)}
              />
            ))}
          </div>
        );
      } else {
        photoContent = (
          <div className="no-photos text-center mt-5 display-4">
            There are no pictures, please add some!
          </div>
        );
      }
    }
    console.log(errors.format);
    return (
      <div className="add-pictures">
        <Link to="/dashboard" className="btn btn-secondary">
          Go Back
        </Link>
        <h1 className="display-4 text-center">Your pictures</h1>
        <div className="custom-file mt-3">
          <input
            type="file"
            name="userPhoto"
            className={classnames("custom-file-input", {
              "is-invalid": errors.format
            })}
            onChange={this.onChange}
          />
          <label className="custom-file-label">
            Choose a file (.jpg, .png or .bmp)
          </label>
          {errors.format && (
            <div className="invalid-feedback">{errors.format}</div>
          )}
        </div>
        {photoContent}
      </div>
    );
  }
}

Photos.propTypes = {
  uploadPhoto: PropTypes.func.isRequired,
  deletePhoto: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { uploadPhoto, getCurrentProfile, deletePhoto }
)(withRouter(Photos));
