import React from "react";
import PropTypes from "prop-types";
import { Container, Input } from "reactstrap";

const RangeInput = ({
  placeholder,
  name,
  value,
  onNumberChange,
  checkValues
}) => (
  <Container>
    <Input
      type="number"
      className="m-2"
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onNumberChange}
      onBlur={checkValues}
    />
    <Input
      className="ml-2"
      type="range"
      name={name}
      max="100"
      min="0"
      step="1"
      value={value}
      onChange={onNumberChange}
      onBlur={checkValues}
    />
  </Container>
);

RangeInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onNumberChange: PropTypes.func.isRequired,
  checkValues: PropTypes.func.isRequired
};

export default RangeInput;
