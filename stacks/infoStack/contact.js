import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

// Component size relative to the screen's dimensions
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class ContactScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    }
  }

  static navigationOptions = {
    title: 'Contact',
  }

  sendMessage() {
    if(this.state.name.length < 1 || this.state.email.length < 1 || this.state.phone.length < 1 || this.state.company.length < 1 || this.state.message.length < 1) {
      Alert.alert(
        'Alert',
        'Please fill out the whole form',
        {text: 'OK'},
      );
    } else {
      console.log('its filled');
    }
  }

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.form} keyboardDismissMode='on-drag' indicatorStyle='white'>
          <View style={styles.form_seperator}>
            <Text style={styles.form_seperator_text}>GET IN TOUCH</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=>{ Linking.openURL('https://bbg.im/')}}>
            <Ionicons name='ios-call' size={20} color='#DCDCDC' style={{marginRight: 8}}/>
            <Text style={styles.item_text}>+447624325444</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=>{ Linking.openURL('https://bbg.im/')}}>
            <Ionicons name='ios-mail' size={20} color='#DCDCDC' style={{marginRight: 8}}/>
            <Text style={styles.item_text}>gary@bestbusiness.com</Text>
          </TouchableOpacity>
          <View style={styles.form_seperator}>
            <Text style={styles.form_seperator_text}>SEND US A MESSAGE</Text>
          </View>
          <TextInput
            style={styles.form_input}
            ref="name"
            placeholder="Full Name"
            placeholderTextColor="#898989"
            keyboardAppearance="dark"
            returnKeyType="next"
            autoCorrect={false}
            onChangeText={(name) => this.setState({name})}
            onSubmitEditing={() => this.refs.email.focus()}
          />
          <TextInput
            style={styles.form_input}
            ref="email"
            placeholder="Email Address"
            placeholderTextColor="#898989"
            keyboardAppearance="dark"
            returnKeyType="next"
            autoCorrect={false}
            onChangeText={(email) => this.setState({email})}
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
            onSubmitEditing={() => this.refs.company.focus()}
            keyboardType='number-pad'
          />
          <TextInput
            style={styles.form_input}
            ref="company"
            placeholder="Company"
            placeholderTextColor="#898989"
            keyboardAppearance="dark"
            returnKeyType="next"
            autoCorrect={false}
            onChangeText={(company) => this.setState({company})}
            onSubmitEditing={() => this.refs.message.focus()}
          />
          <TextInput
            style={[styles.form_input, styles.last]}
            ref="message"
            multiline={true}
            placeholder="Message"
            placeholderTextColor="#898989"
            keyboardAppearance="dark"
            returnKeyType="next"
            autoCorrect={false}
            onChangeText={(message) => this.setState({message})}
            onSubmitEditing={() => this.refs.message.blur()}
          />
          <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={()=> this.sendMessage()}>
            <Text style={{color: '#0D0D0D'}}>Send Message</Text>
          </TouchableOpacity>
          <View style={{height:150, width: screenWidth}}/>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default ContactScreen;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D'
  },
  header: {
    height: screenHeight/8,
    backgroundColor: '#898989',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    flex: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: '#0D0D0D',
  },
  last: {
    height: 150,
    paddingTop: 16
  },
  button: {
    backgroundColor: '#D09138',
    height: 35,
    borderRadius: 6,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: screenWidth/2
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
