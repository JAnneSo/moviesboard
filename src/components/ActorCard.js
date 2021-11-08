import React from "react";

const ActorCard = ({ actor }) => {
  return (
    <div>
      <img src={actor.photo} alt="" />
      <p>{actor.character}</p>
      <p>{actor.name}</p>
    </div>
  );
};

export default ActorCard;
