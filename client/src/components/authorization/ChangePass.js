import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePass } from "../../actions/authActions";
import queryString from "query-string";
import TextFieldGroup from "../common/TextFieldGroup";

class ChangePass extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password2: "",
      errors: {},
      notice: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    const userData = {
      email: values.email,
      code: values.code,
      initCodeCheck: true
    };

    this.props.changePass(userData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.notice.fail || nextProps.notice.success) {
      this.setState({
        notice: nextProps.notice,
        password: "",
        password2: ""
      });
    }
    if (nextProps.notice.success) {
      this.props.history.push("/login");
    }
    if (nextProps.notice.fail) {
      this.props.history.push("/reset-password");
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
      password2: this.state.password2,
      initCodeCheck: false
    };

    this.props.changePass(userData);
  }

  render() {
    const { errors } = this.props;

    return (
      <div className="activation">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Password reset</h1>
              <p className="lead text-center">Please choose new password</p>
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
  errors: PropTypes.object.isRequired,
  notice: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  notice: state.notice
});

export default connect(
  mapStateToProps,
  { changePass }
)(ChangePass);
