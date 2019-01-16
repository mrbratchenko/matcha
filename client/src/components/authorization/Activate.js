import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { activateUser } from "../../actions/authActions";
import queryString from "query-string"; // for parsing req.query for backend
import { Link } from "react-router-dom";

class Activate extends Component {
  constructor() {
    super();
    this.state = {
      errors: {}
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    const userData = {
      email: values.email,
      code: values.code
    };

    this.props.activateUser(userData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="activation">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Activation</h1>
              {errors.activation ? (
                <div className="col-form-label text-danger">
                  {errors.activation}
                </div>
              ) : (
                <div className="col-form-label text-success">
                  Your account has been activated.
                </div>
              )}
              <Link to="/login" className="btn btn-block btn-danger mr-2">
                Proceed to logging in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Activate.propTypes = {
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { activateUser }
)(Activate);
