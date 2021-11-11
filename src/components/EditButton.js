import React from "react";
import { Link } from "react-router-dom";

const EditButton = ({ id }) => {
  return (
    <Link
      to={{
        pathname: `/edit/${id}`
      }}
    >
      <div className="round-button edit-button"></div>
    </Link>
  );
};

export default EditButton;
