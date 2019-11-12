import React, { Component } from "react"
import { View, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Animated, Image } from "react-native";
import axios from 'axios';

class EmployerSearchResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      apiResponse: '',
      businessesOpacity: new Animated.Value(0),
    }
  }

  componentDidMount() {
    const employersArray = this.props.navigation.getParam('employers');
    const locationSlug = this.props.navigation.getParam('locationSlug');
    this.setState({
      apiResponse: employersArray,
      hasLoaded: true,
      resultNumber: employersArray.length,
      locationSlug: locationSlug
    });
    Animated.timing(this.state.businessesOpacity, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }).start();
  }


  static navigationOptions = ({ navigation }) => {
    return {
      title: "Search Result",
    }
  }

  renderSubcategories(item){
    let array = item.map(function (subcategory) {
      return subcategory.name
    });
    return array.join(", ")
  }



  renderEmployer = ({ item }) => {
    return (
      <TouchableOpacity style={styles.business} activeOpacity={0.8} onPress={()=> this.props.navigation.navigate('ViewEmployer',{title: item.name, employer: item, slug: item.slug, locationSlug: this.state.locationSlug})}>
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
  render(){
    return (
      <ScrollView style={styles.container}>
        {this.state.resultNumber == 1 ?
          <Text style={styles.you_searched_for}>{this.state.resultNumber} result for '{this.props.navigation.getParam('title')}'</Text>
        :
          <Text style={styles.you_searched_for}>{this.state.resultNumber} results for '{this.props.navigation.getParam('title')}'</Text>
        }
        {this.state.hasLoaded == true ?
          <Animated.View style={{opacity: this.state.businessesOpacity}}>
            <FlatList
              data={this.state.apiResponse}
              renderItem={this.renderEmployer}
              ref='businessList'
              keyExtractor={(item, index) => index.toString()}
            />
          </Animated.View>
        :
          <ActivityIndicator />
        }
      </ScrollView>
    );
  }
}

export default EmployerSearchResult;

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
  you_searched_for: {
    color: '#DCDCDC',
    fontSize: 14,
    marginTop: 10,
    opacity: 0.8
  }
});
