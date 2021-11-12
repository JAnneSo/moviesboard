import React from "react";

const DeleteButton = (props) => {
  function onDelete() {
    props.onDelete(true);
  }

  return <div className="round-button delete-button" onClick={onDelete}></div>;
};

export default DeleteButton;
