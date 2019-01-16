import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePass } from "../../actions/authActions";
import queryString from "query-string"; // for parsing req.query for backend
import TextFieldGroup from "../common/TextFieldGroup";

class ChangePass extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password2: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const values = queryString.parse(this.props.location.search);

    const userData = {
      email: values.email,
      code: values.code,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.changePass(userData, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="activation">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Password reset</h1>
              <p className="lead text-center">Please chose new password</p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="New password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm new password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <input
                  type="submit"
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

ChangePass.propTypes = {
  changePass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { changePass }
)(ChangePass);
