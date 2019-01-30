import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import isEmpty from "../../validation/is-empty";

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displaySocialInputs: false,
      name: "",
      username: "",
      email: "",
      location: "",
      gender: "",
      preference: "",
      interests: "",
      bio: "",
      twitter: "",
      instagram: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      const profile = nextProps.profile.profile;

      // Bring interests array back to CSV
      const interestsCSV = !isEmpty(profile.interests)
        ? profile.interests.join(",")
        : "";

      // If profile doesn't exist, make empty string
      profile.location = !isEmpty(profile.location) ? profile.location : "";
      profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
      profile.gender = !isEmpty(profile.gender) ? profile.gender : "";
      profile.preference = !isEmpty(profile.preference)
        ? profile.preference
        : "";

      if (!isEmpty(this.state.name)) {
        profile.name = this.state.name;
      }

      if (!isEmpty(this.state.username)) {
        profile.username = this.state.username;
      }

      if (!isEmpty(this.state.email)) {
        profile.email = this.state.email;
      }

      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.facebook = !isEmpty(profile.social.facebook)
        ? profile.social.facebook
        : "";
      profile.instagram = !isEmpty(profile.social.instagram)
        ? profile.social.instagram
        : "";

      // Set component fields state

      this.setState({
        name: profile.name,
        email: profile.email,
        username: profile.username,
        location: profile.location,
        gender: profile.gender,
        preference: profile.preference,
        interests: interestsCSV,
        bio: profile.bio,
        facebook: profile.facebook,
        instagram: profile.instagram
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      location: this.state.location,
      gender: this.state.gender,
      preference: this.state.preference,
      interests: this.state.interests,
      bio: this.state.bio,
      facebook: this.state.facebook,
      instagram: this.state.instagram
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Facebook profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Instagram profile URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }

    // Select options for gender
    const options_gender = [
      { label: "* Select your gender", value: 0 },
      { label: "male", value: "male" },
      { label: "female", value: "female" }
    ];

    const options_preference = [
      { label: "Select your sexual preference", value: 0 },
      { label: "men", value: "men" },
      { label: "women", value: "women" },
      { label: "bisexual", value: "bisexual" }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 md-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">
                {this.state.interests
                  ? "Edit your profile"
                  : "Create your profile"}
              </h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Profile name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="Your name and last name"
                />
                <TextFieldGroup
                  placeholder="* Profile email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="Your email"
                />
                <TextFieldGroup
                  placeholder="* Profile username"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                  error={errors.username}
                  info="Your unique username"
                />

                <SelectListGroup
                  placeholder="* Your gender"
                  name="gender"
                  value={this.state.gender}
                  onChange={this.onChange}
                  error={errors.gender}
                  options={options_gender}
                  info="Your gender"
                />

                <SelectListGroup
                  placeholder="Your sexual preference"
                  name="preference"
                  value={this.state.preference}
                  onChange={this.onChange}
                  error={errors.preference}
                  options={options_preference}
                  info="Your sexual preference"
                />

                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="City or city and state suggested"
                />
                <TextFieldGroup
                  placeholder="* interests"
                  name="interests"
                  value={this.state.interests}
                  onChange={this.onChange}
                  error={errors.interests}
                  info="Please use commas and tags to list your interests(e.g #vegan, #geek, #piercing)"
                />
                <TextAreaFieldGroup
                  placeholder="Biography"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us about yourself"
                />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add social network links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-danger btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(EditProfile));
