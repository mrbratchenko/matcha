import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { resetPass } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";

class ResetPass extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {},
      notice: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (
      nextProps.notice.fail ||
      nextProps.notice.success ||
      nextProps.notice.warning
    ) {
      this.setState({
        notice: nextProps.notice,
        email: ""
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email
    };

    this.props.resetPass(userData, this.props.history);
  }

  render() {
    const { notice, errors } = this.props;

    return (
      <div>
        <div className="reset-pass">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                {notice.loading && !Object.entries(errors).length && (
                  <Spinner />
                )}
                <Alert notice={notice} />
                <h1 className="display-4 text-center">Forgot password?</h1>
                <p className="lead text-center">
                  Please give us your email for password reset
                </p>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
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
      </div>
    );
  }
}

ResetPass.propTypes = {
  resetPass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  notice: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth, //auth comes from reducers/index.js
  errors: state.errors,
  notice: state.notice
});

export default connect(
  mapStateToProps,
  { resetPass }
)(withRouter(ResetPass));
