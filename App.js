import React, { useState } from "react";
import * as Updates from "expo-updates";
import { AppLoading } from "expo";
import { createAppContainer } from "react-navigation";

import StackNavigator from "./navigation/";

const AppContainer = createAppContainer(StackNavigator);

const App = () => {
  const [isChecked, setChecked] = useState(false);

  async function updateApp() {
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();

      if (isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (err) {
      console.log("err with updateApp", err);
    }
  }

  if (!isChecked) {
    return (
      <AppLoading
        startAsync={updateApp}
        onFinish={() => setChecked(true)}
        onError={console.warn}
      />
    );
  }

  return <AppContainer />;
};

export default App;
