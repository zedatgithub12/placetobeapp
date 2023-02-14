import PushNotification, { Importance } from 'react-native-push-notification';
import Constants from '../../constants/Constants';

PushNotification.configure({
    onNotification: function(notification){
        //console.log('Local Notification', notification);
    },
    popInitialNotification: true,
    requestPermissions: true,
});
PushNotification.createChannel({
    channelId: "channel-id", // (required)
    channelName: "My channel", // (required)
    channelDescription: 'A channel is for notification',
    playSound: true,
    soundName: "default",
    importance: Importance.HIGH,
    vibrate:true,
}, 
(created)=> console.log(`channel created '${created}'`),
);

export const LocalNotification =()=>{
    PushNotification.localNotification({
        channelId: 'channel-id',
        channelName: 'my channel',
        autoCancel: true,
        bigText: 'This is for local notification',
        subText: 'today',
        message: 'hello from other side!!!',
        playSound: true,
        soundName: 'default',
        importance: 10,
        vibrate:true,
        vibration: 1000,
        color: Constants.primary,
        onlyAlertOnce: true,
        // actions: ["Yes", "No"],
    });
}