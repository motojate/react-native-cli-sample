/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {Button} from 'react-native';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
import WebView from 'react-native-webview';
import {WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';

function App(): React.JSX.Element {
  const webViewRef = useRef<WebView>(null);

  const sendMessageToWeb = () => {
    const sendData = JSON.stringify({
      id: 1,
      type: '',
      name: 'ssilook',
      content: 'WebView_Test',
    });

    webViewRef.current?.postMessage(sendData);
    console.log(webViewRef.current?.context);
  };

  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.Steps,
      ],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  } as HealthKitPermissions;

  AppleHealthKit.initHealthKit(permissions, (error: string) => {
    /* Called after we receive a response from the system */

    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
    }

    /* Can now read or write to HealthKit */

    // let startDate = new Date(2022, 1, 1).toString(); // 예시 시작 날짜
    // let endDate = new Date().toString(); // 현재 날짜

    AppleHealthKit.getStepCount(
      {date: '2024-03-24'},
      (err: Object, results: any) => {
        if (err) {
          return;
        }

        console.log(results);
        webViewRef.current?.postMessage(results);
      },
    );
  });

  const onMessage = (event: WebViewMessageEvent) => {
    console.log(event.nativeEvent.data);
  };

  return (
    <>
      <WebView
        originWhitelist={['*']}
        source={{uri: 'http://localhost:8082'}}
        ref={webViewRef}
        onMessage={onMessage}
      />
      <Button title="Send Message to Web" onPress={sendMessageToWeb} />
    </>
  );
}

export default App;
