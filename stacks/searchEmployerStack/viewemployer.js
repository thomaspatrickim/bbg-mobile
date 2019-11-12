import React, { Component } from "react"
import { View, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Animated, Image } from "react-native";
import Swiper from 'react-native-swiper';
import axios from 'axios';

class Jobs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      apiResponse: '',
      jobsOpacity: new Animated.Value(0),
    }
    const slug = this.props.navigation.getParam('slug');
    const locationSlug = this.props.navigation.getParam('locationSlug');
    const data = {"employer": slug}

    console.log(slug);
    console.log(locationSlug);
    //Get all businesses for the given trade
    axios({
      method: 'get',
      url: 'http://stage.bestbusiness.com/v1/locations/'+locationSlug+'/job-listings/',
      params: data
    })
    .then((res) => {
      this.setState({
        apiResponse: res.data,
        hasLoaded: true,
      });
      Animated.timing(this.state.jobsOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start();
    })
    .catch((error) => {
      console.log(error);
      //Display alert
      if(error) {
        Alert.alert(
          'Error',
          'Could not load Employer',
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



  renderJobs = ({ item }) => {
    return (
      <TouchableOpacity style={styles.business} activeOpacity={0.8} onPress={()=> this.props.navigation.navigate('ViewJob', {title: item.name, business: item})}>
        <Image source={{uri: item.imageUrls[0]}} style={styles.business_image}/>
        <View style={styles.business_info}>
          <View style={styles.left}>
            <Text style={{fontSize:18, color: '#D09138', marginBottom: 8}}>{item.name}</Text>
            <View style={{flexDirection: 'row', alignSelf: 'stretch'}}>
              <Text style={{color: '#DCDCDC', fontSize: 12 }}>{item.employer.name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderContent = ({ item }) => {
    return (
      <View style={styles.section}>
        <Text style={{color: '#D09138', fontSize: 18, marginBottom: 8}}>{item.heading}</Text>
        <Text style={{color: '#686868', lineHeight: 20, fontWeight: 'normal'}}>{item.body}</Text>
      </View>
    );
  }

  render(){
    const employer = this.props.navigation.getParam('employer');

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.top}>
            <Swiper
            style={{height: 150}}
            showsButtons={true}
            autoplay={true}
            autoplayTimeout={2.5}
            dot={<View style={{backgroundColor:'#898989', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            activeDot={<View style={{backgroundColor: '#F7F7F7', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            nextButton={<Text style={styles.buttonText}>›</Text>}
            prevButton={<Text style={styles.buttonText}>‹</Text>}
            >
              {employer.imageUrls.map((image, imageIdx) => {
                return (
                  <View key={imageIdx} style={styles.slide}>
                    <Image source={{uri: image}} style={{width: '100%', flex: 1}}/>
                  </View>
                )
              })}
            </Swiper>
          </View>
          <View style={styles.bottom}>
            <View style={styles.left}>
              <Text style={{color: '#DCDCDC', fontSize: 18, marginBottom: 8}} >{employer.name}</Text>
            </View>
            <View style={styles.right}>
              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={()=> this.props.navigation.navigate('ContactEmployer', {address: employer.address, email: employer.email, phone: employer.phone})}>
                <Text style={{color: '#898989'}}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={()=> Linking.openURL(employer.websiteUrl)}>
                <Text style={{color: '#898989'}}>Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={employer.content}
            renderItem={this.renderContent}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.section}>
            <Text style={{color: '#D09138', fontSize: 18, marginBottom: 8}}>Job Listings</Text>
            {this.state.hasLoaded == true ?
              <Animated.View style={{opacity: this.state.jobsOpacity}}>
                <FlatList
                  data={this.state.apiResponse}
                  renderItem={this.renderJobs}
                  ref='jobList'
                  keyExtractor={(item, index) => index.toString()}
                />
              </Animated.View>
            :
              <ActivityIndicator />
            }
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Jobs;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
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
  header: {
    minHeight: 300,
    flexDirection: 'column'
  },
  top: {
    backgroundColor: '#898989',
    flex: 3,
  },
  bottom: {
    backgroundColor: '#0D0D0D',
    flexDirection: 'row',
    padding: 16,
    flex: 1,
  },
  left: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 4
  },
  right: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2
  },
  button: {
    alignSelf: 'stretch',
    height: 30,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#898989',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  section: {
    paddingBottom: 16,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    margin: 16
  },
  img: {
    height: 25,
    width: 25,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 50
  }
});
