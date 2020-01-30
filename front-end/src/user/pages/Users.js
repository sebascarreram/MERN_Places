import React from "react";

import UsersList from "../components/UsersList";

const User = () => {
  const USERS = [
    {
      id: "u1",
      name: "Mercedez Ruiz",
      image:
        "https://assets.imgix.net/case-study/unsplash/woman-hat.jpg?mask=ellipse&crop=faces&fit=crop&h=400&w=400",
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default User;
