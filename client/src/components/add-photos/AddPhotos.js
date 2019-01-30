import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { uploadPhoto, getCurrentProfile } from "../../actions/profileActions";

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
    e.preventDefault();

    const { user } = this.props.auth;
    const photoData = new FormData();
    photoData.append("user", user.id);
    photoData.append("myImage", this.state.file);

    // console.log(this.state.file);

    this.props.uploadPhoto(photoData);
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  fileSelect(e) {
    console.log(e);
  }

  render() {
    const { errors } = this.state;
    var photos = this.state.photos;
    var photo1 = this.state.photos[0];
    // photo1 = toString(photo1);
    const photos = this.state.photos.map((photo, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" /> {photo}
      </div>
    ));

    return (
      <div className="add-pictures">
        <Link to="/dashboard" className="btn btn-light">
          Go Back
        </Link>
        <form onSubmit={this.onPictureSubmit}>
          <h1 className="display-4 text-center">Picture Upload</h1>
          <input type="file" name="myImage" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        {photos}
        <div className="row pt-md-5">
          <div className="col-lg-2 col-md-2 col-xs-2 thumb">
            <a className="thumbnail" href="/dashboard">
              <img
                className="img-responsive"
                // src={require('"' + { photo1 } + '"')}
                alt="profile_image_1"
              />
            </a>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-3 thumb">
            <a className="thumbnail" href="/dashboard">
              <img
                className="img-responsive"
                src="../../user-photos/cat.jpeg"
                alt="profile_image_2"
              />
            </a>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2 thumb">
            <a className="thumbnail" href="/dashboard">
              <img
                className="img-responsive"
                src={require("../../cat.jpeg")}
                alt="profile_image_3"
              />
            </a>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2 thumb">
            <a className="thumbnail" href="/dashboard">
              <img
                className="img-responsive"
                src={require("../../cat.jpeg")}
                alt="profile_image_4"
              />
            </a>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2 thumb">
            <a className="thumbnail" href="/dashboard">
              <img
                className="img-responsive"
                src={require("../../cat.jpeg")}
                alt="profile_image_5"
              />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

AddPhotos.propTypes = {
  uploadPhoto: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  errors: PropTypes.object,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile,
  photos: state.photos,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { uploadPhoto, getCurrentProfile }
)(withRouter(AddPhotos));
