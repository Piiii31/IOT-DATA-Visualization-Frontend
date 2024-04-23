import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, ToastAndroid, PermissionsAndroid, Text,Pressable } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { decode, encode } from 'base-64';
import { useFormStore } from '../FormStore';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../GlobalStore';


export default function Form() {
  const [devices, setDevices] = useState('');
  const [devicesError, setDevicesError] = useState('');
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [serverAddress, setServerAddress] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [manager, setManager] = useState<BleManager | null>(null);
  const setMessage = useStore((state) => state.setMessage);
  const [formData, setFormData] = useState([]);
  const addFormData = useFormStore((state) => state.addFormData);
  const [Sended, setSended] = useState(false);
  const [ssidError, setSSIDError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverAddressError, setServerAddressError] = useState('');
  const [serverPortError, setServerPortError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [userPasswordError, setUserPasswordError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigation();
  useEffect(() => {
    requestBluetoothPermission();
    const bleManager = new BleManager();
    setManager(bleManager);
    
    return () => {
      bleManager.destroy();
    };
  }, []);

  

  

  const requestBluetoothPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      if (
        granted["android.permission.BLUETOOTH_ADVERTISE"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.BLUETOOTH_ADVERTISE"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
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
      navigate.navigate('Home' as any);
    } catch (error) {
      console.error("Error during device connection:", error);
      ToastAndroid.show("Failed to connect to device. Please try again.", ToastAndroid.LONG);
    }
  };

  ;

  const handleSubmit = async () => {

    let isValid = true;

    if (!manager) {
      console.error("BleManager not initialized");
      ToastAndroid.show("Bluetooth not available. Please try again.", ToastAndroid.LONG);
      return;
    }

    if (!devices) {
      setDevicesError('Server Port is required');
      isValid = false;
    }
    if (!ssid) {
      setSSIDError('SSID is required');
      isValid = false;
    }
  
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
  
    if (!serverAddress) {
      setServerAddressError('Server Address is required');
      isValid = false;
    }
  
    if (!serverPort) {
      setServerPortError('Server Port is required');
      isValid = false;
    }
  
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
  
    if (!userPassword) {
      setUserPasswordError('User Password is required');
      isValid = false;
    }
  
    if (!isValid) {
      return;
    }
    
    setFormSubmitted(true);
    try {
      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.error("Error during device scan:", error);
          ToastAndroid.show("Failed to scan for devices. Please try again.", ToastAndroid.LONG);
          return;
        }

        if (device && device.name === devices) {
          manager.stopDeviceScan();
          await handleDeviceConnection(device);
          const datatorender = {
            devices,
            ssid,
            password,
            serverAddress,
            serverPort,
            username,
            userPassword
          }
          addFormData(datatorender);
          console.log("Data to render:", Sended);
          
        }
      });
    } catch (error) {
      console.error("Error during handle submit:", error);
      ToastAndroid.show("Failed to submit data. Please try again.", ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      
{devicesError ? <Text style={styles.errorText}>{devicesError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="Name of Device"
  value={devices}
  onChangeText={(text) => {
    setDevices(text);
    if (!text) {
      setDevicesError('Device Name is required');
    } else {
      setDevicesError('');
    }
  }}
/>

{ssidError ? <Text style={styles.errorText}>{ssidError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="SSID"
  value={ssid}
  onChangeText={(text) => {
    setSSID(text);
    if (!text) {
      setSSIDError('SSID is required');
    } else {
      setSSIDError('');
    }
  }}
/>


{passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="Password"
  value={password}
  onChangeText={(text) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  }}
  secureTextEntry
/>


{serverAddressError ? <Text style={styles.errorText}>{serverAddressError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="Server Address"
  value={serverAddress}
  onChangeText={(text) => {
    setServerAddress(text);
    if (!text) {
      setServerAddressError('Server Address is required');
    } else {
      setServerAddressError('');
    }
  }}
/>


{serverPortError ? <Text style={styles.errorText}>{serverPortError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="Server Port"
  value={serverPort}
  onChangeText={(text) => {
    setServerPort(text);
    if (!text) {
      setServerPortError('Server Port is required');
    } else {
      setServerPortError('');
    }
  }}
  keyboardType="numeric"
/>


{usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="Username"
  value={username}
  onChangeText={(text) => {
    setUsername(text);
    if (!text) {
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }
  }}
/>


{userPasswordError ? <Text style={styles.errorText}>{userPasswordError}</Text> : null}
<TextInput
  style={[
    styles.input,
    formSubmitted ? styles.successBorder : styles.defaultBorder,
    devicesError ? styles.errorBorder : null
  ]}
  placeholder="User Password"
  value={userPassword}
  onChangeText={(text) => {
    setUserPassword(text);
    if (!text) {
      setUserPasswordError('User Password is required');
    } else {
      setUserPasswordError('');
    }
  }}
  secureTextEntry
/>
      <Pressable onPress={handleSubmit} style={styles.submit}>
      <Text style={styles.textsubmit}  >Submit</Text>
      
        
      
      
      
    </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  input: {
    borderRadius: 5,
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
    height:"auto"
  },
  receivedDataTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  receivedData: {
    textAlign: 'left',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    marginRight: 90,
    width: 200,
  },
  defaultBorder: {
    borderColor: 'gray',
  },
  errorBorder: {
    borderColor: 'red',
  },
  successBorder: {
    borderColor: 'green',
  },
  submit: {
    backgroundColor: '#39e75f',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 30,
  },
  textsubmit: {
    padding: 5,
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
    width: '100%',
  },
  
});
