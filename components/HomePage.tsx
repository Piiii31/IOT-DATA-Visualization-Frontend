import { View, Text, TouchableOpacity,StyleSheet, FlatList, StatusBar, ImageBackground } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Listitem from './Listitem'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFormStore } from '../FormStore';
import { Searchbar } from 'react-native-paper';
import Header  from './Header';


const HomePage = () => {
    const navigation = useNavigation()
    const formData = useFormStore((state) => state.formData);
    const deleteItem = useFormStore((state: { deleteFormData: any }) => state.deleteFormData);
    const [searchQuery, setSearchQuery] = React.useState('')
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const handlePress = () => {
        navigation.navigate('Form' as any )
    }



    const EditFormPress = (index: number) => {
        navigation.navigate('EditForm' as any , { index: index });
      }

    const handleDelete = (index: number) => {
        deleteItem(index);
      };

    return (
        <ImageBackground source={require('../assets/cornered-stairs.png')} style={style.container}>
            
            <StatusBar barStyle="dark-content" />
            <Header/>
            <Searchbar style={style.searchbar}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        
        
            />

<FlatList
  data={formData.filter((item: { devices: string }) => item.devices.toLowerCase().includes(searchQuery.toLowerCase()))}
  renderItem={({ item, index }) => (
    <Listitem
      devices={item.devices}
      ssid={item.ssid}
      serverAddress={item.serverAddress}
      serverPort={item.serverPort}
      onEditPress={() => EditFormPress(index)}
      onDeletePress={() => handleDelete(index)}
        onChartPress={() => navigation.navigate('Charts' as any, { index: index })}
      
      
    />
  )}
  keyExtractor={(item, index) => index.toString()}
/>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 600,
                    right: 16,

                    backgroundColor: '#39e75f',
                    padding: 10,
                    borderRadius: 20,
                }}
                onPress={handlePress}
            >
                <Ionicons name="add" size={40} color="white" />
                
            </TouchableOpacity>
            
            
        </ImageBackground>
    )
}

export default HomePage



const style = StyleSheet.create({
    
        container: {
            flex:1
            
        },
        searchbar: {
            marginBottom: 20,
            margin: 10,
            borderRadius: 10,
            backgroundColor: '#EEE',
            color: 'white',
        }
        
        })