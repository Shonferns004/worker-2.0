import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerDevicePushToken = async () => {
  try {
    // Remote push token registration is disabled for now.
    // Local in-app notifications continue to work via expo-notifications.
    return null;
  } catch (error) {
    return null;
  }
};
