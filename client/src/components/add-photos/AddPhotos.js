import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { uploadPhoto, getCurrentProfile } from "../../actions/profileActions";
import Picture from "../common/Picture";
import classnames from "classnames";

class AddPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      errors: {},
      file: null
    };

    this.onPictureSubmit = this.onPictureSubmit.bind(this);
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
    } else if (nextProps.profile.profile) {
      const photos = nextProps.profile.profile.photos;
      console.log(photos);

      this.setState({
        photos: photos
      });
    }
  }

  onPictureSubmit(e) {
    const { user } = this.props.auth;
    const photoData = new FormData();
    photoData.append("user", user.id);
    photoData.append("myImage", this.state.file);

    // console.log(this.state.file);

    this.props.uploadPhoto(photoData);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({ file: e.target.files[0] }, () => {
      this.onPictureSubmit();
    });
  }

  fileSelect(e) {
    console.log(e);
  }

  render() {
    const { errors } = this.state;

    const photos = this.state.photos;

    var images = require.context("../../user-photos", true);

    return (
      <div className="add-pictures">
        <Link to="/dashboard" className="btn btn-secondary">
          Go Back
        </Link>

        <h1 className="display-4 text-center">Your pictures</h1>
        <div className="custom-file mt-3">
          <input
            type="file"
            name="myImage"
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

        {/* <form onSubmit={this.onPictureSubmit}>
          <h1 className="display-4 text-center">Picture Upload</h1>
          <input
            type="file"
            name="myImage"
            onChange={this.onChange}
            className="mt-3 "
          />
          <button type="submit" className="btn btn-secondary">
            Upload
          </button>
          {errors.format && <div className="text-danger">{errors.format}</div>}
        </form> */}
        <div className="row pt-md-5">
          <Picture
            source={photos[0] && images(`./${photos[0]}`)}
            alt="profile_picture_1"
          />
          <Picture
            source={photos[1] && images(`./${photos[1]}`)}
            alt="profile_picture_2"
          />
          <Picture
            source={photos[2] && images(`./${photos[2]}`)}
            alt="profile_picture_3"
          />
          <Picture
            source={photos[3] && images(`./${photos[3]}`)}
            alt="profile_picture_4"
          />
          <Picture
            source={photos[4] && images(`./${photos[4]}`)}
            alt="profile_picture_5"
          />
        </div>
      </div>
    );
  }
}

AddPhotos.propTypes = {
  uploadPhoto: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  photos: PropTypes.array,
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
  { uploadPhoto, getCurrentProfile }
)(withRouter(AddPhotos));
