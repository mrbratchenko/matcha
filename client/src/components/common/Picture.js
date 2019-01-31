import React from "react";
import noPicture from "../../img/empty-photo.jpg";

const Picture = ({ source, alt }) => {
  return (
    <div className="col-lg-2 col-md-2 col-xs-2 thumb">
      <div className="form-check form-check-inline mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="inlineCheckbox1"
          value="option1"
        />
        <label className="form-check-label" htmlFor="inlineCheckbox1">
          Set as avatar
        </label>
      </div>
      <img
        className="img-thumbnail"
        src={source ? source : noPicture}
        alt={alt}
        style={{ height: "120px" }}
      />
      <button
        // onClick={this.onDeleteClick.bind(this, edu._id)}
        className="btn btn-danger mt-3"
      >
        Delete
      </button>
    </div>
  );
};

export default Picture;
