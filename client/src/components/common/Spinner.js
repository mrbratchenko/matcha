import React from "react";
import loading from "../../img/ring-loader.gif";

export default function Spinner() {
  return (
    <div>
      <img
        src={loading}
        style={{
          width: "100px",
          dislay: "block",
          margin: "auto"
        }}
        alt="Loading..."
      />
    </div>
  );
}
