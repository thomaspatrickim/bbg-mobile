import React, { Component } from "react"
import { View, SafeAreaView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Linking, ImageBackground, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
// Component size relative to the screen's dimensions
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const device = DeviceInfo.getDeviceId();
let responsivePadding = 10
//If the Device is iPhone X or above
if(device == 'iPhone10,3' || device == 'iPhone10,6' || device == 'iPhone11,2'|| device == 'iPhone11,4'|| device == 'iPhone11,6'|| device == 'iPhone11,8') {
  responsivePadding = 35
}
class InfoScreen extends Component {


  constructor(props) {
    super(props);
    this._retrieveData()
  }

  static navigationOptions = {
    header: null
  }


  _retrieveData = async () => {
    try {
      const locationSlug = await AsyncStorage.getItem('locationSlug');
      if (locationSlug !== null) {
        // Found location Slug from storage
        this.getInfo(locationSlug)
      }
    } catch (error) {
      // Error retrieving data
      Alert.alert(
        'Error',
        'Network Error',
        {text: 'OK'},
      );
    }
  };

  getInfo(locationSlug){
    //Get all regions for displaying
    axios({
      method: 'get',
      url: 'http://stage.bestbusiness.com/v1/locations/slug/'+locationSlug,
    })
    .then((res) => {
      // this.setState({
      //
      // })
    })
    .catch((error) => {
      //Display alert
      if(error) {
        Alert.alert(
          'Error',
          'Could not load Locations',
          {text: 'OK'},
        );
      }
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <View>
          <ImageBackground source={require('../../images/bg.png')} style={styles.header}>
            <Text style={{fontSize: 18, color: '#F7F7F7'}}>Info</Text>
          </ImageBackground>
        </View>
        <View>
          <View style={[styles.item, {backgroundColor: '#0D0D0D'}]}>
            <Text style={[styles.item_text, {color: '#D09138'}]}>BEST BUSINESS GUIDE</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={() => this.props.navigation.navigate('about')}>
            <Text style={styles.item_text}>About BBG</Text>
            <Ionicons name='ios-arrow-forward' size={20} color='#DCDCDC' style={{marginRight: 8}}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={() => this.props.navigation.navigate('contact')}>
            <Text style={styles.item_text}>Contact BBG</Text>
            <Ionicons name='ios-arrow-forward' size={20} color='#DCDCDC' style={{marginRight: 8}}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=> Linking.openURL('https://bbg.im/')}>
            <Text style={styles.item_text}>Visit Our Website</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={() => this.props.navigation.navigate('RegionSelect')}>
            <Text style={styles.item_text}>Change Region</Text>
            <Ionicons name='ios-arrow-forward' size={20} color='#DCDCDC' style={{marginRight: 8}}/>
          </TouchableOpacity>
          <View style={[styles.item, {backgroundColor: '#0D0D0D'}]}>
            <Text style={[styles.item_text, {color: '#D09138'}]}>LEGAL</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=> Linking.openURL('https://www.bbg.im/terms-and-conditions/')}>
            <Text style={styles.item_text}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=> Linking.openURL('https://www.bbg.im/privacy-policy/')}>
            <Text style={styles.item_text}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={[styles.item, {backgroundColor: '#0D0D0D'}]}>
            <Text style={[styles.item_text, {color: '#D09138'}]}>APP VERSION 2.0.4</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default InfoScreen;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D'
  },
  header: {
    height: screenHeight/8,
    width: screenWidth,
    backgroundColor: '#898989',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: responsivePadding,
  },
  form: {
    flex: 1,
  },
  item: {
    height: 50,
    backgroundColor: '#1B191A',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0D0D0D'
  },
  item_text: {
    color: '#DCDCDC'
  },
});
