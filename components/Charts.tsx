import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { View, Text, Button, Dimensions,StyleSheet, Pressable } from "react-native";
import React, { useRef, MutableRefObject, useState } from "react";
import ViewShot from "react-native-view-shot";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useStorageAreaData } from "../api/fetchdata";
import { useFormStore } from "../FormStore";
import FileViewer from 'react-native-file-viewer';

const Charts = ({ route, navigation }: { route: any, navigation: any }) => {
  const { index } = route.params;
  const formData = useFormStore((state: { formData: { [x: string]: any; }; }) => state.formData[index]);
  const [devices, setDevices] = useState(formData.devices);
const [serverAddress, setServerAddress] = useState(formData.serverAddress);
const [serverPort, setServerPort] = useState(formData.serverPort);

const { data, isLoading, error } = useStorageAreaData(devices, serverAddress, serverPort);
const windowHeight = Dimensions.get('window').height;
const viewShotRef = useRef<ViewShot | null>(null);

const onExportToPdf = async () => {
  if (viewShotRef.current?.capture) {
    const uri = await viewShotRef.current.capture();

    const html = `
    <img src="${uri}" style="width: 100%; height: ${windowHeight}px;" />
    `;

    const options = {
      html,
      fileName: 'chart',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);

    // Now you have a PDF file at file.filePath.
    console.log(file.filePath);

    // Open the PDF file if filePath is defined
    if (file.filePath) {
      FileViewer.open(file.filePath)
        .then(() => {
          console.log('File open success');
        })
        .catch(error => {
          console.log('File open error', error);
        });
    }
  }
};

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error has occurred</Text>;

  const tData = data && Array.isArray(data) ? data.filter((item: any) => item.sensor_type === 'T').map((item: any) => item.value) : [];
  const hData = data && Array.isArray(data) ? data.filter((item: any) => item.sensor_type === 'H').map((item: any) => item.value) : [];

  return (
    <>
    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={{ backgroundColor: 'white' }}>
    <View style={{ flexDirection: 'column', height: 400, padding: 20,marginVertical:30 }}>
        <Text style={{ fontSize: 20, color: 'red' }}>Temperature</Text>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <YAxis
          data={tData}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}°C`}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={tData}
          svg={{ stroke: 'red' }}
          contentInset={{ top: 20, bottom: 20 }}
          
          yAccessor={({ item }) => item}
        >
          <Grid />
        </LineChart>
      </View>
      <Text style={{ fontSize: 20, color: 'blue' }}>Humidity</Text>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        
        <YAxis
          data={hData}
          contentInset={{ top: 20, bottom: 20}}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}%`} 
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={hData}
          svg={{ stroke: 'blue' }}
          contentInset={{ top: 20, bottom: 20}}
          
          yAccessor={({ item }) => item}
        >
          <Grid />
        </LineChart>
      </View>
    </View>
    
    </ViewShot>
    <Pressable onPress={onExportToPdf} style={styles.submit}>
      <Text style={styles.text}>Export To PDF</Text>
    </Pressable>
    
    </>
  );
};

export default Charts;



const styles = StyleSheet.create({

submit: {
    
    marginLeft: 30,
    
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    width: '100%',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});