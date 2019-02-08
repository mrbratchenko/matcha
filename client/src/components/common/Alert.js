import React from "react";
import classnames from "classnames";

const Alert = ({ notice }) => {
  return notice.fail || notice.success || notice.warning ? (
    <div
      className={classnames("alert alert-dismissible fade show", [
        {
          "alert-success": notice.success
        },
        {
          "alert-danger": notice.fail
        },
        {
          "alert-warning": notice.warning
        }
      ])}
      role="alert"
    >
      <strong>{notice.fail || notice.success || notice.warning}</strong>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  ) : (
    <div />
  );
};

export default Alert;
