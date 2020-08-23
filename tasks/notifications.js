import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const localNotification = {
  title: "⚠️ Zone à risque ⚠️",
  body: "On remet son 😷!",
  ios: {
      sound: true
  }
};

export const submitNotification = async () =>
  await Notifications.presentLocalNotificationAsync(localNotification);

export const askNotification = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (Constants.isDevice && status === "granted")
    console.log("Notification permissions granted.");
};
