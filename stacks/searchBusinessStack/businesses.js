import React, { Component } from "react"
import { View, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Animated, Image } from "react-native";
import axios from 'axios';

class Businesses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      apiResponse: '',
      businessesOpacity: new Animated.Value(0),
    }
    const subcategorySlug = this.props.navigation.getParam('subcategorySlug');
    const locationSlug = this.props.navigation.getParam('locationSlug');
    const data = {"subcategory": subcategorySlug}
    //Get all businesses for the given trade
    axios({
      method: 'get',
      url: 'http://stage.bestbusiness.com/v1/locations/'+locationSlug+'/businesses/',
      params: data
    })
    .then((res) => {
      let featured = false;
      let otherQualifiers = false;
      if(res.data[0].length >= 1) {
        featured = true;
      }
      if(res.data[1].length >= 1) {
        otherQualifiers = true;
      }
      console.log(res.data);
      this.setState({
        apiResponse: res.data[0],
        featured: featured,
        apiResponseOtherQualifiers: res.data[1],
        otherQualifiers: otherQualifiers,
        hasLoaded: true,
      });
      Animated.timing(this.state.businessesOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start();
    })
    .catch((error) => {
      //Display alert
      if(error) {
        Alert.alert(
          'Error',
          'Could not load Businesses',
          {text: 'OK'},
        );
      }
    });
  }


  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
    }
  }

  renderSubcategories(item) {
    let array = item.map(function (subcategory) {
      return subcategory.name
    });
    return array.join(", ")
  }




  renderBusiness = ({ item }) => {
    return (
      <TouchableOpacity style={styles.business} activeOpacity={0.8} onPress={()=> this.props.navigation.navigate('ViewBusiness',{title: item.name, business: item, subcategories: this.renderSubcategories(item.subcategories)})}>
        <Image source={{uri: item.imageUrls[0]}} style={styles.business_image}/>
        <View style={styles.business_info}>
          <View style={styles.left}>
            <Text style={{fontSize:18, color: '#D09138', marginBottom: 8}}>{item.name}</Text>
            <View style={{flexDirection: 'row', alignSelf: 'stretch'}}>
              <Text style={{color: '#DCDCDC', fontSize: 12 }}>{this.renderSubcategories(item.subcategories)}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={{fontSize: 13, color: '#DCDCDC'}}>{item.yearsQualified} Years</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  renderOtherQualifiers = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.item_text}>{item.name}</Text>
      </View>
    );
  }

  render(){
    return (
      <ScrollView style={styles.container}>
        {this.state.featured == true ?
          <View style={styles.seperator}>
            <Text style={styles.seperator_text}>FEATURED BUSINESSES</Text>
          </View>
        :
          null
        }
        {this.state.hasLoaded == true ?
          <Animated.View style={{opacity: this.state.businessesOpacity}}>
            <FlatList
              data={this.state.apiResponse}
              renderItem={this.renderBusiness}
              ref='businessList'
              keyExtractor={(item, index) => index.toString()}
            />
          </Animated.View>
        :
          <ActivityIndicator />
        }
        {this.state.otherQualifiers == true ?
          <View style={styles.seperator}>
            <Text style={styles.seperator_text}>OTHER QUALIFIERS</Text>
          </View>
        :
          null
        }
        {this.state.hasLoaded == true ?
          <Animated.View style={{opacity: this.state.businessesOpacity, marginBottom: 16}}>
            <FlatList
              data={this.state.apiResponseOtherQualifiers}
              renderItem={this.renderOtherQualifiers}
              ref='businessList'
              keyExtractor={(item, index) => index.toString()}
            />
          </Animated.View>
        :
          null
        }
      </ScrollView>
    );
  }
}

export default Businesses;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
  },
  seperator: {
    height: 50,
    backgroundColor: '#0D0D0D',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  seperator_text: {
    color: '#D09138'
  },
  business: {
    minHeight: 250,
    backgroundColor: '#181818',
    flexDirection: 'column',
    marginVertical: 16
  },
  business_image: {
    flex: 5,
    backgroundColor: '#898989'
  },
  business_info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  left: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  right: {
    flex: 1
  },
  item: {
    height: 50,
    backgroundColor: '#1B191A',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0D0D0D'
  },
  item_text: {
    color: '#DCDCDC'
  },
});
