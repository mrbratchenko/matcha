import React from "react";
import loading from "../../img/ring-loader.gif";

export default function Spinner() {
  return (
    <div>
      <img
        src={loading}
        style={{
          width: "20%",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }}
        alt="Loading..."
      />
    </div>
  );
}
