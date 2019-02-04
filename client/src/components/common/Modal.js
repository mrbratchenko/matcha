import React from "react";

const Modal = style => {
  let im;
  //   im = display;

  return (
    <div id="mydisplay" className="modal" style={{ display: style }}>
      <span className="close" onClick={() => console.log(im)}>
        &times;
      </span>

      <img
        className="modal-content"
        id="img01"
        alt="preview"
        src="https://news.nationalgeographic.com/content/dam/news/2018/05/17/you-can-train-your-cat/02-cat-training-NationalGeographic_1484324.ngsversion.1526587209178.adapt.1900.1.jpg"
      />

      <div id="caption" alt="" />
    </div>
  );
};

export default Modal;
