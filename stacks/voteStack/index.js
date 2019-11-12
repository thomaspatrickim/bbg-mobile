import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ImageBackground, Animated, FlatList } from "react-native";
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
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

const starRatingArray = [
  {
    title: 'Remuneration',
    text: '(How does your rate of pay compare to the industry standard)',
    rating: 0
  },
  {
    title: 'Benefits',
    text: '(e.g bonuses, shares, car, parking, pension, health care, etc ..)',
    rating: 0
  },
  {
    title: 'Career Progression',
    text: '(potential for promotion, training and career advancement)',
    rating: 0
  },
  {
    title: 'Working Environment/Culture',
    text: '(do you feel valued, respected and part of a team)',
    rating: 0
  },
  {
    title: 'Work/Life Balance',
    text: '(working hours, holidays, and general wellbeing in your workplace)',
    rating: 0
  },
]


class VoteScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      business_name: '',
      business_branch: '',
      name: '',
      phone: '',
      email_address: '',
      recommendation: '',
      business: '',
      starCount: 0,
      starCoun2: 0,
      starCount3: 0,
      starCount4: 0,
      starCount5: 0,
      btocBackgroundColor: new Animated.Value(1),
      btobBackgroundColor: new Animated.Value(0),
      employerBackgroundColor: new Animated.Value(0),
      formOpacity: new Animated.Value(1),
      businessText: 'BUSINESS',
      recommendationText: 'RECOMMENDATION',
      showStarRating: false,
      showBusiness: false,
      showJobTitle: false,
      rating: 0,
      starRating: 0,
      starRating2: 0,
      starRating3: 0,
      starRating4: 0,
      starRating5: 0,
      hasChanged: 0,
      formType: 'btoc',
    }
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const locationSlug = await AsyncStorage.getItem('locationSlug');
      if (locationSlug !== null) {
        // Found location Slug from storage
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

  sendRecommendation() {
    let name = this.state.name;
    let email_address = this.state.email_address;
    let phone = this.state.phone;
    let business_name = this.state.business_name;
    let business_branch = this.state.business_branch;
    let voteBody = this.state.recommendation;
    var business = this.state.business;
    var job_title = this.state.job_title;
    let data = {
      "yourName": name,
      "yourEmail": email_address,
      "yourPhone": phone,
      "businessName": business_name,
      "businessBranch": business_branch,
      "voteBody": voteBody,
    }
    // If Main Form is filled out
    if(name.length > 1 && email_address.length > 1 && phone.length > 1 && business_name.length > 1 && business_branch.length > 1 && voteBody.length > 1) {
      // if it's btob and everything is filled out
      if(this.state.formType == 'btob' && business.length > 1) {
        // add to object and send email
        data["yourBusiness"] = business;
        this.sendEmail(data)
      } else if(this.state.formType == 'employer' && job_title.length > 1) {
        // add to object and send email
        data["yourPosition"] = job_title;
        this.sendEmail(data)
      } else if(this.state.formType == 'btoc' ){
        // send email
        this.sendEmail(data)
      } else {
        // There's missing form elements
        Alert.alert(
          'Error',
          'Please fill out the whole form before submitting',
          {text: 'OK'},
        );
      }
    } else {
      // There's missing form elements
      Alert.alert(
        'Error',
        'Please fill out the whole form before submitting',
        {text: 'OK'},
      );
    }
  }

  sendEmail(data) {
    axios({
      method: 'post',
      url: 'http://stage.bestbusiness.com/v1/locations/'+this.state.locationSlug+'/votes/submit/'+this.state.formType,
      data: data
    })
    .then((res) => {
      Alert.alert(
        'Error',
        'Your recommendation has been sent.',
        {text: 'OK'},
      );
      this.props.navigation.navigate('Trades')
    })
    .catch((error) => {
      console.log(error);
      //Display alert
      if(error) {
        Alert.alert(
          'Error',
          'Could not send recommendation',
          {text: 'OK'},
        );
      }
    });
  }

  setFormType(formType) {
    Animated.sequence([
      Animated.timing(this.state.formOpacity, {
        toValue: 0,
        duration: 200,
      }),
      Animated.timing(this.state.formOpacity, {
        toValue: 1,
        duration: 100,
      }),
    ]).start(() => {
      if(formType == 'btob') {
        this.setState({
          formType: formType,
          btocBackgroundColor: new Animated.Value(0),
          btobBackgroundColor: new Animated.Value(1),
          employerBackgroundColor: new Animated.Value(0),
          businessText: 'BUSINESS',
          recommendationText: 'RECOMMENDATION',
          showStarRating: false,
          showBusiness: true,
          showJobTitle: false,
        })
      } else if (formType == 'btoc') {
        this.setState({
          formType: formType,
          btocBackgroundColor: new Animated.Value(1),
          btobBackgroundColor: new Animated.Value(0),
          employerBackgroundColor: new Animated.Value(0),
          businessText: 'BUSINESS',
          recommendationText: 'RECOMMENDATION',
          showStarRating: false,
          showBusiness: false,
          showJobTitle: false,
        })
      } else {
        this.setState({
          formType: formType,
          btocBackgroundColor: new Animated.Value(0),
          btobBackgroundColor: new Animated.Value(0),
          employerBackgroundColor: new Animated.Value(1),
          businessText: 'WORKPLACE',
          recommendationText: 'REVIEW',
          showStarRating: true,
          showBusiness: false,
          showJobTitle: true,
        })
      }
    });
  }

  starRating(starRating, index){
    if(index == 0 ) {
      starRatingArray[index].rating = starRating;
    } else if (index == 1) {
      starRatingArray[index].rating = starRating;
    } else if (index == 2) {
      starRatingArray[index].rating = starRating;
    } else if (index == 3) {
      starRatingArray[index].rating = starRating;
    } else if (index == 4) {
      starRatingArray[index].rating = starRating;
    }
    this.setState({
      hasChanged: !this.state.hasChanged
    });
  }

  renderStarRating = ({ item, index }) => {
    return (
      <View style={styles.score}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{color:'#DCDCDC', marginVertical: 4}}>{item.title}</Text>
          <Text style={{color:'#898989', fontSize: 10}}>{item.text}</Text>
        </View>
        <View style={{flex: 1}}>
          <StarRating
            maxStars={5}
            rating={item.rating}
            selectedStar={(starRating) => this.starRating(starRating, index)}
            iconSet='Ionicons'
            emptyStar='ios-star-outline'
            emptyStarColor='#D0913850'
            fullStar='ios-star'
            fullStarColor='#D09138'
            halfStarEnabled={false}
            starSize={20}
            containerStyle={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10}}
          />
        </View>
      </View>
    );
  }

  render(){
    let starRating =
    <View>
      <View style={styles.form_seperator}>
        <Text style={styles.form_seperator_text}>YOUR SCORE</Text>
      </View>
      <FlatList
        data={starRatingArray}
        renderItem={this.renderStarRating}
        ref='businessList'
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state.hasChanged}
      />
    </View>


    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

    var btocBackgroundColor = this.state.btocBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#0D0D0D','#D09138'],
    });
    var btocTextColor = this.state.btocBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#D09138','#0D0D0D'],
    });
    var btobBackgroundColor = this.state.btobBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#0D0D0D','#D09138'],
    });
    var btobTextColor = this.state.btobBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#D09138','#0D0D0D'],
    });
    var employerBackgroundColor = this.state.employerBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#0D0D0D','#D09138'],
    });
    var employerTextColor = this.state.employerBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#D09138','#0D0D0D'],
    });

    return (
      <View style={styles.container}>
        <View>
          <ImageBackground source={require('../../images/bg.png')} style={styles.header}>
            <Text style={{fontSize: 18, color: '#F7F7F7'}}>Vote for a Business/Employer</Text>
          </ImageBackground>
        </View>
        <View style={styles.form_seperator}>
          <Text style={styles.form_seperator_text}>I AM VOTING AS...</Text>
        </View>
        <View style={{flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#232323'}}>
          <AnimatedTouchableOpacity activeOpacity={0.8} style={[styles.vote_option, {backgroundColor: btocBackgroundColor}]} onPress={() => this.setFormType('btoc')}>
            <Animated.Text style={[styles.option_text, {color: btocTextColor}]}>Customer</Animated.Text>
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity activeOpacity={0.8} style={[styles.vote_option, {backgroundColor: btobBackgroundColor}]} onPress={() => this.setFormType('btob')}>
            <Animated.Text style={[styles.option_text, {color: btobTextColor}]}>Business</Animated.Text>
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity activeOpacity={0.8} style={[styles.vote_option, {backgroundColor: employerBackgroundColor}]} onPress={() => this.setFormType('employer')}>
            <Animated.Text style={[styles.option_text, {color: employerTextColor}]}>Employee</Animated.Text>
          </AnimatedTouchableOpacity>
        </View>
        <ScrollView ref="form" style={styles.form} keyboardDismissMode='on-drag' indicatorStyle='white'>
          <Animated.View style={{opacity: this.state.formOpacity}}>
            <View style={styles.form_seperator}>
              <Text style={styles.form_seperator_text}>YOUR DETAILS</Text>
            </View>
            <TextInput
              style={styles.form_input}
              ref="name"
              placeholder="Your Name"
              placeholderTextColor="#898989"
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={(name) => this.setState({name})}
              onSubmitEditing={() => this.refs.email_address.focus()}
            />
            {this.state.showBusiness == true?
              <TextInput
                style={styles.form_input}
                ref="business"
                placeholder="Your Business"
                placeholderTextColor="#898989"
                keyboardAppearance="dark"
                returnKeyType="next"
                editable={this.state.businessIsDisabled}
                autoCorrect={false}
                onChangeText={(business) => this.setState({business})}
                onSubmitEditing={() => this.refs.email_address.focus()}
              />
            :
              null
            }
            <TextInput
              style={styles.form_input}
              ref="email_address"
              placeholder="Your Email Address"
              placeholderTextColor="#898989"
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={(email_address) => this.setState({email_address})}
              onSubmitEditing={() => this.refs.phone.focus()}
              keyboardType='email-address'
            />
            <TextInput
              style={styles.form_input}
              ref="phone"
              placeholder="Phone Number"
              placeholderTextColor="#898989"
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={(phone) => this.setState({phone})}
              onSubmitEditing={() => this.refs.recommendation.focus()}
              keyboardType='number-pad'
            />
            <View style={styles.form_seperator}>
              <Text style={styles.form_seperator_text}>{this.state.businessText} DETAILS</Text>
            </View>
            <TextInput
              style={styles.form_input}
              ref="business_name"
              placeholder="Business Name"
              placeholderTextColor="#898989"
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={(business_name) => this.setState({business_name})}
              onSubmitEditing={() => this.refs.business_branch.focus()}
            />
            <TextInput
              style={styles.form_input}
              ref="business_branch"
              placeholder="Branch / Location"
              placeholderTextColor="#898989"
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={(business_branch) => this.setState({business_branch})}
              onSubmitEditing={() => this.refs.recommendation.focus()}
            />
            {this.state.showJobTitle == true?
              <TextInput
                style={[styles.form_input, {opacity: this.state.jobTitleOpacity}]}
                ref="job_title"
                placeholder="Your Position/Job Title"
                placeholderTextColor="#898989"
                keyboardAppearance="dark"
                returnKeyType="next"
                editable={this.state.jobTitleIsEditable}
                autoCorrect={false}
                onChangeText={(job_title) => this.setState({job_title})}
                onSubmitEditing={() => this.refs.recommendation.focus()}
              />
            :
              null
            }
            <View style={styles.form_seperator}>
              <Text style={styles.form_seperator_text}>YOUR {this.state.recommendationText}</Text>
            </View>
            <TextInput
              style={[styles.form_input, styles.recommendation]}
              multiline={true}
              ref="recommendation"
              placeholder="Begin typing here..."
              placeholderTextColor="#898989"
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={(recommendation) => this.setState({recommendation})}
              onSubmitEditing={() => this.refs.recommendation.blur()}
            />
            {this.state.showStarRating == true ?
              starRating
            :
              null
            }
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={()=>this.sendRecommendation()}>
              <Ionicons style={{marginRight: 5 }} name="ios-send" size={20} color="#141414"/>
              <Text style={{color: '#0D0D0D'}}>Send Recommendation</Text>
            </TouchableOpacity>
            <View style={{height:150, width: screenWidth}}/>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}


export default VoteScreen;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    height: screenHeight/8,
    backgroundColor: '#898989',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: responsivePadding,
    width: screenWidth
  },
  form: {
    flex: 1,
    height: 600,
  },
  form_seperator: {
    height: 50,
    backgroundColor: '#0D0D0D',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16
  },
  form_seperator_text: {
    color: '#D09138'
  },
  form_input: {
    height: 50,
    backgroundColor: '#1B191A',
    color: '#F7F7F7',
    alignSelf: 'stretch',
    paddingLeft: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0D0D0D',
  },
  vote_option: {
    borderWidth: 1,
    borderColor: '#D09138',
    height: 35,
    flex: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4
  },
  option_text: {
    color: '#D09138'
  },
  recommendation: {
    height: 150,
    paddingTop: 16
  },
  button: {
    backgroundColor: '#D09138',
    height: 35,
    borderRadius: 6,
    marginVertical: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: screenWidth-128
  },
  score: {
    height: 70,
    backgroundColor: '#1B191A',
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingLeft: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0D0D0D',
  }
});
