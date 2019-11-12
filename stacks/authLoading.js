import React, { Component } from "react"
import { View, StyleSheet, ActivityIndicator, Text} from "react-native";
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const locationSlug = await AsyncStorage.getItem('locationSlug')
      if (locationSlug !== null) {
        this.props.navigation.navigate('Trades')
      } else {
        this.props.navigation.navigate('RegionSelect')
      }
    } catch (error) {
      // Error retrieving data
      this.props.navigation.navigate('RegionSelect')
    }
  };


  static navigationOptions = {
    header: null
  }


  render(){
    return (
        <View style={styles.container}>
          <ActivityIndicator/>
          <Text style={{color: '#DCDCDC', marginTop: 6}}>Loading...</Text>
        </View>
    );
  }
}

export default AuthLoadingScreen;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
