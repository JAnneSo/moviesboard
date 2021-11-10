import React from "react";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

const EditButton = ({ id }) => {
  return (
    <Link
      to={{
        pathname: `/edit/${id}`
      }}
    >
      <span>
        <BsPencilSquare />
      </span>
    </Link>
  );
};

export default EditButton;
