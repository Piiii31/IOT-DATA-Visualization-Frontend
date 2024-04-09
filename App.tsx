import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, ToastAndroid, PermissionsAndroid, Text } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { decode, encode } from 'base-64';

export default function App() {
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [serverAddress, setServerAddress] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [manager, setManager] = useState<BleManager | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    requestBluetoothPermission();
    const bleManager = new BleManager();
    setManager(bleManager);
    
    return () => {
      bleManager.destroy();
    };
  }, []);

  useEffect(() => {
    const ReceivedData = async () => {
      try {
        const socket = new WebSocket('ws://192.168.137.218:80/ws');

        socket.onopen = () => {
          console.log('WebSocket connection opened');
        };

        socket.onmessage = (event: MessageEvent<any>) => {
          console.log('WebSocket message received:', event.data);
          setMessage(event.data);
        };

        socket.onerror = (error: Event) => {
          console.error('WebSocket error:', error);
        };

        socket.onclose = (event: CloseEvent) => {
          console.log('WebSocket connection closed:', event);
        };

        return () => {
          socket.close();
        };
      } catch (error) {
        console.error('Error during WebSocket connection:', error);
      }
    };

    ReceivedData();
  }, []);

  

  const requestBluetoothPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);
      if (
        granted["android.permission.BLUETOOTH_ADVERTISE"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.BLUETOOTH_ADVERTISE"] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Bluetooth permission granted');
      } else {
        console.log('Bluetooth permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDeviceConnection = async (device: Device) => {
    try {
      const connectedDevice = await device.connect();
      ToastAndroid.show("Connected to device", ToastAndroid.SHORT);
  
      const services = await connectedDevice.discoverAllServicesAndCharacteristics();
      const characteristics = await services.characteristicsForService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
      const characteristic = characteristics.find(c => c.uuid === 'beb5483e-36e1-4688-b7f5-ea07361b26a8');
  
      if (!characteristic) {
        throw new Error("Characteristic not found");
      }
  
      const dataToSend = {
        ssid,
        password,
        serverAddress,
        serverPort: parseInt(serverPort),
        username,
        userPassword
      };
      console.log("Data to send:", dataToSend);
      ToastAndroid.show("Sending data to device", ToastAndroid.SHORT);
  
      const jsonData = JSON.stringify(dataToSend);
      const base64Data = encode(jsonData);
  
      await characteristic.writeWithResponse(base64Data);
      ToastAndroid.show("Wrote data to characteristic", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error during device connection:", error);
      ToastAndroid.show("Failed to connect to device. Please try again.", ToastAndroid.LONG);
    }
  };

  ;

  const handleSubmit = async () => {
    if (!manager) {
      console.error("BleManager not initialized");
      ToastAndroid.show("Bluetooth not available. Please try again.", ToastAndroid.LONG);
      return;
    }

    try {
      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.error("Error during device scan:", error);
          ToastAndroid.show("Failed to scan for devices. Please try again.", ToastAndroid.LONG);
          return;
        }

        if (device && device.name === 'ESP32') {
          manager.stopDeviceScan();
          await handleDeviceConnection(device);
        }
      });
    } catch (error) {
      console.error("Error during handle submit:", error);
      ToastAndroid.show("Failed to submit data. Please try again.", ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="SSID"
        value={ssid}
        onChangeText={setSSID}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Server Address"
        value={serverAddress}
        onChangeText={setServerAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Server Port"
        value={serverPort}
        onChangeText={setServerPort}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="User Password"
        value={userPassword}
        onChangeText={setUserPassword}
        secureTextEntry
      />
      <View>
      <Button title="Submit" onPress={handleSubmit} />
      
        <View style={styles.receivedDataContainer}>
          <Text style={styles.receivedDataTitle}>Received Data:</Text>
          <Text>Received Message: {message}</Text>
        </View>
      
      </View>
      
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  receivedDataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 100,
    height: 100,
  },
  receivedDataTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  receivedData: {
    textAlign: 'left',
  },
});
