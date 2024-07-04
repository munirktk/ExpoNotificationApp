import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, handleNotification } from './src/utils/notificationHelper';

export default function App() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();

      notificationListener.current = Notifications.addNotificationReceivedListener(handleNotification);

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
      });
    })();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const sendPushNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification by munir.",
          data: { data: 'goes here' },
        },
        trigger: { seconds: 1 },
      });
      console.log('Notification scheduled');
    } catch (error) {
      console.log('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Expo Notifications App!</Text>
      <Button title="Send Notification" onPress={sendPushNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
