import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import "./UserItem.css";

const UserItem = props => {
  return (
    <li className="user-item">
      {/* -- Content -- */}
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          {/* Content image */}
          <div className="user-item__image">
            {/* <img src={props.image} alt={props.name} /> */}
            <Avatar
              image={`http://localhost:5000/${props.image}`}
              alt={props.name}
            />
          </div>
          {/* Content info */}
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};
export default UserItem;
