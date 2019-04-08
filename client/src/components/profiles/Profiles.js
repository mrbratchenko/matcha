import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getProfiles } from "../../actions/profileActions";
import ProfileItem from "./ProfileItem";
import { WithContext as ReactTags } from "react-tag-input";
import {
  Container,
  Row,
  Card,
  Col,
  ListGroupItem,
  Input,
  FormGroup,
  Badge,
  Form
} from "reactstrap";

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [
        { id: "Thailand", text: "Thailand" },
        { id: "India", text: "India" }
      ],
      suggestions: [
        { id: "USA", text: "USA" },
        { id: "Germany", text: "Germany" },
        { id: "Austria", text: "Austria" },
        { id: "Costa Rica", text: "Costa Rica" },
        { id: "Sri Lanka", text: "Sri Lanka" },
        { id: "Thailand", text: "Thailand" }
      ],
      ageFrom: "",
      ageTo: "",
      fameFrom: "",
      fameTo: "",
      location: ""
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  onChange = e => {
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
    const { tags, suggestions } = this.state;

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
                <h3 className="pl-3">
                  <Badge color="info">Sort by:</Badge>
                </h3>

                <ListGroupItem>
                  <Row>
                    <h3>
                      <Badge className="m-2" color="secondary">
                        Age gap
                      </Badge>
                    </h3>
                    <Col>
                      <Input
                        className="m-2"
                        placeholder="from"
                        name="ageFrom"
                        value={this.state.ageFrom}
                        onChange={this.onChange}
                      />
                      <Input
                        className="ml-2"
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                      />
                    </Col>
                    <Col>
                      <Input
                        className="m-2"
                        placeholder="to"
                        name="ageTo"
                        value={this.state.ageTo}
                        onChange={this.onChange}
                      />
                      <Input
                        className="ml-2"
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                      />
                    </Col>
                  </Row>
                  {/* </Form> */}
                </ListGroupItem>
                <ListGroupItem>
                  {/* <Form> */}
                  <Row>
                    <h3>
                      <Badge className="m-2" color="secondary">
                        Fame rating
                      </Badge>
                    </h3>
                    <Col>
                      <Input
                        className="m-2"
                        placeholder="from"
                        name="ageFrom"
                        value={this.state.fameFrom}
                        onChange={this.onChange}
                      />
                      <Input
                        className="ml-2"
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                      />
                    </Col>
                    <Col>
                      <Input
                        className="m-2"
                        placeholder="to"
                        name="ageTo"
                        value={this.state.fameTo}
                        onChange={this.onChange}
                      />
                      <Input
                        className="ml-2"
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                      />
                    </Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <h3>
                    <Badge className="m-2" color="secondary">
                      Location
                    </Badge>
                  </h3>
                  <Input
                    className="m-2"
                    placeholder="Location"
                    name="ageTo"
                    value={this.state.location}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <h3>
                    <Badge className="m-2" color="secondary">
                      Interests
                    </Badge>
                  </h3>
                  <ReactTags
                    tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters}
                  />
                </ListGroupItem>
              </Row>
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
  // state.profile is a reducer from index.js  - combineReducers
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
// Connect connects react with redux
