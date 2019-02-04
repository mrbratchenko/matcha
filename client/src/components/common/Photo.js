import React from "react";
// import noPicture from "../../img/ring-loader.gif";

const Photo = ({
  source,
  index,
  onDeleteClick,
  onAvatarClick,
  onImageClick
}) => {
  let im;

  try {
    im = require(`../../user-photos/${source[index]}`);
  } catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      // im = noPicture;
      return null;
    }
  }

  return (
    <div className="col-lg-2 col-md-2 col-xs-2 thumb">
      <img
        href=""
        className="img-thumbnail"
        src={im}
        alt="profile_image"
        style={{ height: "120px", width: "auto" }}
        onClick={onImageClick}
      />
      <div className="btn-group btn-group-sm">
        <button className="btn btn-primary mt-3" onClick={onAvatarClick}>
          Set as avatar
        </button>
        <button className="btn btn-danger mt-3" onClick={onDeleteClick}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Photo;
