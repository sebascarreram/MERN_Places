import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageURL:
      "https://images.unsplash.com/photo-1502104034360-73176bb1e92e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7482476,
      lng: -73.9873916
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageURL:
      "https://images.unsplash.com/photo-1502104034360-73176bb1e92e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7482476,
      lng: -73.9873916
    },
    creator: "u2"
  }
];
const UserPlaces = props => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
