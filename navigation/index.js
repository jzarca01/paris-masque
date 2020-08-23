import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import Map from "../screens/Map";

export default createStackNavigator(
  {
    Map,
  },
  {
    headerMode: "none",
    initialRouteName: "Map",
  }
);
