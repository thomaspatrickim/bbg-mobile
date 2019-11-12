import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, StatusBar, Image, FlatList, Alert, ActivityIndicator } from "react-native";
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import axios from 'axios';
// Component size relative to the screen's dimensions
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const device = DeviceInfo.getDeviceId();
let responsivePadding = 25
//If the Device is iPhone X or above
if(device == 'iPhone10,3' || device == 'iPhone10,6' || device == 'iPhone11,2'|| device == 'iPhone11,4'|| device == 'iPhone11,6'|| device == 'iPhone11,8') {
  responsivePadding = 45
}
class RegionSelectScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      apiResponse: ''
    }
    const data = {"bbgLocation": true};
    //Get all regions for displaying
    axios({
      method: 'get',
      url: 'http://stage.bestbusiness.com/v1/locations',
      params: data,
    })
    .then((res) => {
      res = res.data;
      this.setState({
        apiResponse: res,
        hasLoaded: true,
      });
      this._retrieveData();
    })
    .catch((error) => {
      //Display alert
      if(error) {
        console.log(error);
        Alert.alert(
          'Error',
          'Could not load Locations',
          {text: 'OK'},
        );
      }
    });
  }

  _retrieveData = async () => {
    try {
      const firebaseTopic = await AsyncStorage.getItem('firebaseTopic')
      if (firebaseTopic !== null) {
        // Found firebase Topic from storage
        firebase.messaging().unsubscribeFromTopic(firebaseTopic)
      }
    } catch (error) {
      // Error retrieving data
    }
  };


  static navigationOptions = {
    title: 'Settings',
    headerStyle: {
      backgroundColor: '#0D0D0D',
      borderBottomWidth: 1,
      borderBottomColor: '#232323'
    },
  }

  async checkPermission(firebaseTopic) {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken(firebaseTopic);
    } else {
        this.requestPermission(firebaseTopic);
    }
  }
  async getToken(firebaseTopic) {
    let fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // Subscribe user to the region topic
      firebase.messaging().subscribeToTopic(firebaseTopic);
      this.props.navigation.navigate('Trades');
    }
  }
  async requestPermission(firebaseTopic) {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken(firebaseTopic);
    } catch (error) {
        this.props.navigation.navigate('Trades');
    }
  }

  setRegion(firebaseTopic, slug) {
    AsyncStorage.multiSet([['firebaseTopic', firebaseTopic], ['locationSlug', slug]]);
    this.checkPermission(firebaseTopic);
    this.props.navigation.navigate('Trades');
  }

  renderLocation = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={() => this.setRegion(item.fireBaseTopic, item.slug)}>
        <Text style={styles.item_text}>{item.name}</Text>
        <Ionicons name='ios-arrow-forward' size={20} color='#f7f7f7' style={{marginRight: 8}}/>
      </TouchableOpacity>
    );
  }
  render(){
    return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Image style={{width:(screenHeight/8)+65, height: (screenHeight/8)+65, marginHorizontal: 8, alignSelf: 'center', overflow: 'visible'}} source={require('../images/logo-gold.png')}/>
          <View style={[styles.item, {backgroundColor: '#0D0D0D'}]}>
            <Text style={[styles.item_text, {color: '#D09138'}]}>SELECT A REGION</Text>
          </View>
          <View>
          {this.state.hasLoaded == true ?
            <FlatList
              data={this.state.apiResponse}
              renderItem={this.renderLocation}
              ref='locationList'
              keyExtractor={(item, index) => index.toString()}
            />
          :
            <ActivityIndicator />
          }
          </View>
        </View>
    );
  }
}

export default RegionSelectScreen;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingTop: responsivePadding
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
