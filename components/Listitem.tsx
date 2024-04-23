import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable,Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../GlobalStore';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';


const Listitem = ({ devices, ssid, serverAddress, serverPort,onEditPress,onDeletePress,onChartPress }: { devices: any, ssid: any, serverAddress: any, serverPort: any,onEditPress: () => void,onDeletePress: () => void,onChartPress: () => void  }) => {

  
  const message = useStore((state) => state.message); // Use the useStore hook to access the message state
  const setMessage = useStore((state) => state.setMessage);
  
  useEffect(() => {
    const ReceivedData = async () => {
      try {
        const socket = new WebSocket('ws://esp32A1.local:80/ws');
  
        socket.onopen = () => {
          console.log('WebSocket connection opened');
        };
  
        socket.onmessage = (event: MessageEvent<any>) => {
          console.log('WebSocket message received:', event.data);
          setMessage(event.data);
        };
  
        socket.onerror = (error: Event) => {
          console.error('WebSocket error:', error);
          setMessage(error.toString());
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
  
    // Call ReceivedData immediately
    ReceivedData();
  
    // Then call it every 1 minute
    
  
    // Clear the interval when the component unmounts
    return () => {
      
    };
  }, []);

  const renderRightActions = (progress: any, dragX: { interpolate: (arg0: { inputRange: number[]; outputRange: number[]; }) => any; }) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <Icon.Button 
            name="edit" 
            size={30} 
            color="white" 
            style={styles.Edit} 
            onPress={onEditPress} 
          />
        </Animated.View>
  
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <Icon1.Button 
            name="cancel" 
            size={30} 
            color="white" 
            style={styles.Delete} 
            onPress={onDeletePress} 
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <Pressable onLongPress={onChartPress}>
    <Swipeable renderRightActions={renderRightActions}>
    
    <View style={styles.container}>
      <View style={styles.item}>
      {message === 'Success' ? (
            <View style={styles.successView}>
              <Text style={styles.successText}>Success!</Text>
            </View>
          ) : (
            <View style={styles.failedView}>
              <Text style={styles.failedText}>Failed!</Text>
            </View>
          )}
        <View style={styles.cont} >
          <View style={styles.row1}>
          <Text style={styles.text}>Devices: {devices}</Text>
          <Text style={styles.text}>SSID: {ssid}</Text>
          </View>
          <View style={styles.row2}>
          
          <Text style={styles.text}>IP: {serverAddress}</Text>
          </View>
          
        </View>
      </View>
    </View>
    
    </Swipeable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    padding: 10,
    height: 'auto', // Changed to auto
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#39e75f',
    borderRadius: 10,
    marginBottom: 10,

  },
  text: {
    color: 'white',
    marginBottom: 5,
    width: 80,
  },
  successView: {
    backgroundColor: '#39e75f',
    borderRadius: 10,
    padding: 5,
    marginTop: 5,
  },
  successText: {
    color: 'white',
  },
  failedView: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
    marginTop: 5,
  },
  failedText: {
    color: 'white',
  },Edit: {
    
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    
  },
  Delete:{
    
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 25,
    padding: 10,
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cont: {
    flexDirection: 'column',
    gap: 40
   

  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  row2: {
    flexDirection: 'row',
    
    justifyContent: 'flex-start',
    alignItems: 'center',
    
    
    
    
  },

});

export default Listitem;
