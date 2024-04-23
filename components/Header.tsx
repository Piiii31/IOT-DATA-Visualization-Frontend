import { View, Text, StyleSheet,Image } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

const Header = () => {
    return (
        
        <View>
            <View style={styles.Header}>
                <View style={styles.column}>
                <Text style={styles.textStyle}>Welcome to</Text>
                <Text style={styles.textStyle1}>OIL4MED Application</Text>
                
                </View>
                <FontAwesome name="user-circle" size={40} color="black" />
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Header : {
        
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginTop : 30,
        marginHorizontal : 20,
        marginBottom : 20,
        
    },
    textStyle : {
        fontSize : 20,
        flexDirection : 'column',
        
    },
    column : {
        flexDirection : 'column',
        justifyContent : 'center',
        
    },
    textStyle1:{
        flexDirection:'column',
        width: 200,
    },
    imageStyle : {
        marginVertical : 0,
        width : 50,
        height : 50,
        
    }
})

export default Header;
