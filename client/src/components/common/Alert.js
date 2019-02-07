import React from "react";
import classnames from "classnames";

const Alert = ({ notice }) => {
  return (
    <div>
      {(notice.fail || notice.success) && (
        <div
          className={classnames("alert alert-dismissible fade show", [
            {
              "alert-success": notice.success
            },
            {
              "alert-danger": notice.fail
            }
          ])}
          role="alert"
        >
          <strong>{notice.fail || notice.success}</strong>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert;
