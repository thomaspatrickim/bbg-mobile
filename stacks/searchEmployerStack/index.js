import React, { Component, PureComponent} from "react";
import { withNavigation } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Animated, View, ScrollView, Text, StatusBar, TextInput, Dimensions, StyleSheet, TouchableOpacity, SectionList, ImageBackground, Alert, ActivityIndicator, Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import SectionListItem from './sectionListItem'
import axios from 'axios';
const device = DeviceInfo.getDeviceId();
const brand = DeviceInfo.getBrand();
let searchSectionPaddingTop = 45
let containerExtraHeight = 166
let listMoveHeight = -215
let fadeInTextBottom = 25
//If the Device is iPhone X or above
if(device == 'iPhone10,3' || device == 'iPhone10,6' || device == 'iPhone11,2'|| device == 'iPhone11,4'|| device == 'iPhone11,6'|| device == 'iPhone11,8') {
  searchSectionPaddingTop = 80
  containerExtraHeight = 117
  listMoveHeight = -200
  fadeInTextBottom = 20
} else if(brand != 'Apple') {
  searchSectionPaddingTop = 65
  containerExtraHeight = 166
  listMoveHeight = -215
  fadeInTextBottom = 25
}
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const { height, width } = Dimensions.get("window");

class SectionListHeader extends React.PureComponent {
  render(){
    return (
      <View style={styles.trades_section}>
        <Text style={styles.trades_section_text}>{this.props.item}</Text>
      </View>
    )
  }
}


export default class EmployerTrades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hasLoaded: false,
      apiResponse: '',
      locationSlug: '',
      employersOpacity: new Animated.Value(0),
    };
    this._retrieveData()
  }

  _retrieveData = async () => {
    try {
      const locationSlug = await AsyncStorage.getItem('locationSlug');
      if (locationSlug !== null) {
        // Found location Slug from storage
        this.loadEmployers(locationSlug)
        this.setState({locationSlug})
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

  loadEmployers(locationSlug){
    //Get all trades for displaying
    axios({
      method: 'get',
      url: 'http://stage.bestbusiness.com/v1/locations/'+locationSlug+'/employers',
    })
    .then((res) => {
      this.setState({
        apiResponse: res.data,
        hasLoaded: true,
      });
      Animated.timing(this.state.employersOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start();
    })
    .catch((error) => {
      //Display alert
      Alert.alert(
        'Error',
        'Could not load employers',
        {text: 'OK'},
      );
    });
  }

  static navigationOptions = {
    header: null
  }


  formatEmployers() {
    const letterArray = [
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ];
    let array = letterArray.map((x) => {return {title: x, data: this.alphabeticalOrder(x)}});
    array = array.filter((x) => {
      return x.data.length > 0
    })
    return array;
  }

  alphabeticalOrder(key){
    let array = [];
    let apiResponse = this.state.apiResponse
    apiResponse.forEach(function (item) {
      if(item.name.charAt(0) == key) {
        array.push(item)
      }
    });
    return array;
  }

  performSearch(searchTerm) {
    axios({
      method: 'get',
      url: 'http://stage.bestbusiness.com/v1/locations/'+this.state.locationSlug+'/employers/search/'+searchTerm,
    })
    .then((res) => {
      if(res.data == '') {
        Alert.alert(
          'Error',
          "No Results for '"+searchTerm+"'",
          {text: 'OK'},
        );
      } else {
        this.props.navigation.navigate('EmployerSearchResult', {employers: res.data, title: searchTerm, locationSlug: this.state.locationSlug})
      }
    })
    .catch((error) => {
      //Display alert
      if(error) {
        Alert.alert(
          'Error',
          'Network error',
          {text: 'OK'},
        );
      }
    });
  }

  render(props) {

    this.scrollY = new Animated.Value(0);

    var listMov = this.scrollY.interpolate({
      inputRange: [-180, 0, 200],
      outputRange: [0, 0, listMoveHeight],
      extrapolate: 'clamp',
    });

    var headerOpacity = this.scrollY.interpolate({
      inputRange: [0, 140, 180],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    var titleOpacity = this.scrollY.interpolate({
      inputRange: [0, 140, 180],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    let header = <View style={styles.search}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../../images/bg-employer.png')} style={styles.search}>
      <Animated.View style={{flexDirection: 'column', alignItems: 'center', opacity: headerOpacity}}>
        <Image source={require('../../images/logo-white.png')} style={styles.logo}/>
        <Text style={styles.logo_text_large}>Best Business Guide</Text>
        <Text style={styles.logo_text_small}>Customer Recommended Employers 2019</Text>
        <View style={styles.search_bar}>
          <Ionicons style={styles.search_bar_icon} name="ios-search" size={20} color="#5C5C5C"/>
          <TextInput
            style={styles.search_bar_input}
            clearButtonMode='while-editing'
            autoCapitalize="none"
            ref="searchbar"
            placeholder="Search..."
            placeholderTextColor="#5C5C5C"
            keyboardAppearance="dark"
            returnKeyType="search"
            autoCorrect={false}
            blurOnSubmit={true}
            onSubmitEditing={({nativeEvent: {text}}) => this.performSearch(text)}
          />
        </View>
      </Animated.View>
      <Animated.Text style={[styles.fadeInText, {opacity: titleOpacity}]}>All Employers A-Z</Animated.Text>
      </ImageBackground>
    </View>

    return (
      <View style={{flex: 1, backgroundColor: '#0D0D0D'}}>
        <Animated.View style={[styles.container, {transform: [{ translateY: listMov }]}]}>
          {header}
          {this.state.apiResponse?
            this.renderScroll()
          :
            <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator/>
            </View>
          }
        </Animated.View>
      </View>
    );
  }
  _handleScroll(e) {
    // console.log(e.nativeEvent.contentOffset.y, "jvjhvhm");
  }

  _renderItem = ({item}) => (
    <SectionListItem
         item={item}
    />
  );
  _renderSectionHeader = ({section: {title}}) => (
    <SectionListHeader
         item={title}
    />
  );

  renderScroll(props) {

    const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

    return (
        <AnimatedSectionList
          style={{opacity: this.state.employersOpacity}}
          ListHeaderComponent={<View style={styles.trades_header}><Text style={styles.trades_header_text}>ALL EMPLOYERS A-Z</Text></View>}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          sections={this.formatEmployers()}
          keyExtractor={(item, index) => item + index}
          stickySectionHeadersEnabled={true}
          indicatorStyle="white"
          initialNumToRender={10}
          // Declarative API for animations ->
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.scrollY
                  }
                }
              }
            ],
            {
              useNativeDriver: true
            }
          )}
        />
    );
  }
}

const styles= StyleSheet.create({
  container: {
    height: screenHeight+containerExtraHeight,
    paddingTop: 300,
  },
  search: {
    height: 300,
    backgroundColor: '#898989',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: 0,
    width: screenWidth,
    paddingTop: searchSectionPaddingTop,
  },
  logo: {
    height: 75,
    width: 85,
    marginBottom: 10,
    overflow: 'visible',
  },
  logo_text_large: {
    color: 'white',
    fontSize: 20,
    marginVertical: 5
  },
  logo_text_small: {
    color: 'white',
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    marginHorizontal: 8
  },
  search_bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 11,
    shadowColor: "black",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 3,
    margin: 16,
  },
  search_bar_icon: {
    padding: 10,
    alignSelf: 'center'
  },
  search_bar_input: {
    flex: 1,
    paddingVertical: 10,
    color: '#5C5C5C',
    backgroundColor: 'white',
    alignSelf: 'stretch',
    height: 50,
    paddingRight: 16
  },
  trades: {
    backgroundColor: '#0D0D0D',
    flex: 1,
  },
  trades_header: {
    height: 45,
    backgroundColor: '#0D0D0D',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  trades_header_text: {
    color: '#D09138'
  },
  trades_section: {
    height: 25,
    backgroundColor: '#0D0D0D',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  trades_section_text: {
    color: '#5C5C5C',
    fontSize: 13
  },
  fadeInText: {
    color: '#F7F7F7',
    fontSize: 18,
    alignSelf: 'center',
    width: screenWidth,
    textAlign: 'center',
    position: 'absolute',
    bottom: fadeInTextBottom
  }
});
