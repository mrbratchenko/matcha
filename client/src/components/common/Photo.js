import React from "react";
import noPicture from "../../img/empty-photo.jpg";

const Photo = ({ source, alt, onDeleteClick }) => {
  const images = require.context("../../user-photos", false);
  try {
    source = images("./" + source);
  } catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      source = noPicture;
      // console.log("error");
    }
  }
  console.log(source);
  return (
    <div className="col-lg-2 col-md-2 col-xs-2 thumb">
      <div className="form-check form-check-inline mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="inlineCheckbox1"
          value="option1"
        />
        <label className="form-check-label" htmlFor="inlineCheckbox1" />
      </div>
      <img
        className="img-thumbnail"
        src={source}
        alt={alt}
        style={{ height: "120px" }}
      />
      <button className="btn btn-danger mt-3" onClick={onDeleteClick}>
        Delete
      </button>
    </div>
  );
};

export default Photo;
