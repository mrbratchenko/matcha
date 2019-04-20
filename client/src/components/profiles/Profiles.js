import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getProfiles } from "../../actions/profileActions";
import ProfileItem from "./ProfileItem";
import {
  Container,
  Row,
  Card,
  Col,
  ListGroupItem,
  Input,
  Badge,
  Button
} from "reactstrap";
import TagsInput from "react-tagsinput";
import RangeInput from "../common/RangeInput";

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      tag: "",
      ageFrom: "",
      ageTo: "",
      fameFrom: "",
      fameTo: "",
      location: ""
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleTagChange = tags => {
    this.setState({ tags });
  };

  checkValues = e => {
    console.warn(e.target);
    if (
      e.target.name === "ageFrom" &&
      e.target.value !== "" &&
      this.state.ageTo !== "" &&
      parseInt(e.target.value) > parseInt(this.state.ageTo)
    ) {
      const temp = e.target.value;
      e.target.value = this.state.ageTo;
      this.setState({ ageTo: temp });
    }

    if (
      e.target.name === "ageTo" &&
      e.target.value !== "" &&
      this.state.ageTo !== "" &&
      parseInt(e.target.value) < parseInt(this.state.ageFrom)
    ) {
      const temp = e.target.value;
      e.target.value = this.state.ageFrom;
      this.setState({ ageFrom: temp });
    }

    if (
      e.target.name === "fameFrom" &&
      e.target.value !== "" &&
      this.state.fameTo !== "" &&
      parseInt(e.target.value) > parseInt(this.state.fameTo)
    ) {
      const temp = e.target.value;
      e.target.value = this.state.fameTo;
      this.setState({ fameTo: temp });
    }

    if (
      e.target.name === "fameTo" &&
      e.target.value !== "" &&
      this.state.fameTo !== "" &&
      parseInt(e.target.value) < parseInt(this.state.fameFrom)
    ) {
      const temp = e.target.value;
      e.target.value = this.state.fameFrom;
      this.setState({ fameFrom: temp });
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  handleTagChangeInput = tag => {
    this.setState({ tag });
  };

  onNumberChange = e => {
    if (e.target.value < 0) {
      e.target.value = 0;
    }
    if (e.target.value > 100) {
      e.target.value = 100;
    }
    if (e.target.value === "00") {
      e.target.value = 0;
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found</h4>;
      }
    }

    return (
      <Container>
        <Row>
          <Col className="md-12">
            <h1 className="display-4 text-center">Dating Profiles</h1>
            <p className="lead text-center">Browse and connect</p>
            <Card className="sorting container card-body bg-light mb-3">
              <Row className="list-group p-3 ">
                <h3 className="pl-4">
                  <Badge color="info">Filter by:</Badge>
                </h3>

                <ListGroupItem>
                  <Row>
                    <Col xs="auto mr-5">
                      <h3>
                        <Badge className="m-2" color="secondary">
                          Age gap
                        </Badge>
                      </h3>
                    </Col>
                    <Col xs="auto">
                      <RangeInput
                        placeholder={"from"}
                        name={"ageFrom"}
                        value={this.state.ageFrom}
                        onNumberChange={this.onNumberChange}
                        checkValues={this.checkValues}
                      />
                    </Col>
                    <Col xs="auto">
                      <RangeInput
                        placeholder={"to"}
                        name={"ageTo"}
                        value={this.state.ageTo}
                        onNumberChange={this.onNumberChange}
                        checkValues={this.checkValues}
                      />
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col xs="auto mr-3">
                      <h3>
                        <Badge className="m-2" color="secondary">
                          Fame rating
                        </Badge>
                      </h3>
                    </Col>
                    <Col xs="auto">
                      <RangeInput
                        placeholder={"from"}
                        name={"fameFrom"}
                        value={this.state.fameFrom}
                        onNumberChange={this.onNumberChange}
                        checkValues={this.checkValues}
                      />
                    </Col>
                    <Col xs="auto">
                      <RangeInput
                        placeholder={"to"}
                        name={"fameTo"}
                        value={this.state.fameTo}
                        onNumberChange={this.onNumberChange}
                        checkValues={this.checkValues}
                      />
                    </Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <Row>
                    <Col xs="auto">
                      <h3>
                        <Badge className="m-2" color="secondary">
                          Location
                        </Badge>
                      </h3>
                    </Col>
                    <Col>
                      <Input
                        className="m-2"
                        placeholder="Location"
                        name="location"
                        value={this.state.location}
                        onChange={this.onChange}
                      />
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col xs="auto">
                      <h3>
                        <Badge className="m-2" color="secondary">
                          Interests
                        </Badge>
                      </h3>
                    </Col>
                    <Col className="mt-1">
                      <TagsInput
                        value={this.state.tags}
                        onChange={this.handleTagChange}
                        inputValue={this.state.tag}
                        onChangeInput={this.handleTagChangeInput}
                        inputProps={{
                          placeholder: "Add interest"
                        }}
                      />
                    </Col>
                  </Row>
                </ListGroupItem>
              </Row>
              <Button
                color="info"
                onClick={() => this.props.getProfiles(this.state)}
              >
                Submit
              </Button>
            </Card>
            {profileItems}
          </Col>
        </Row>
      </Container>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
