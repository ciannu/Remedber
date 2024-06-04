// src/utils/notifications.ts
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    if (Constants.easConfig?.projectId) {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.easConfig.projectId,
        })
      ).data;
      console.log(token);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function schedulePushNotification(date: Date) {
  const trigger = new Date(date);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got notification! 🔔",
      body: "JOAN GILIPOLLAS",
      data: { data: "goes here" },
    },
    trigger,
  });
}
