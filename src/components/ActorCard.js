import React, { useState } from "react";
import { base_image_url } from "../services/TMDBService";

const ActorCard = ({ actor }) => {
  const [img_path, setImg_path] = useState(base_image_url);
  if (actor.profile_path) {
    setImg_path((cur) => cur + actor.profile_path);
  } else if (actor.photo) {
    setImg_path((cur) => cur + actor.photo);
  } else {
    setImg_path("/film_strip.jpeg");
  }
  //todo : gérer le cas où il n'y a aucune image
  return (
    <div>
      <img src={img_path} alt="" />
      <p>{actor.character}</p>
      <p>{actor.name}</p>
    </div>
  );
};

export default ActorCard;
