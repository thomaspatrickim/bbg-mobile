import React, { Component } from "react"
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Linking } from "react-native";
// Component size relative to the screen's dimensions
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class ContactEmployer extends Component {

  static navigationOptions = {
    title: 'Contact Details',
  }

 // ANDROID IS ********> " tel: "


  render(){
    const address = this.props.navigation.getParam('address');
    const email = this.props.navigation.getParam('email');
    const phone = this.props.navigation.getParam('phone');
    const website = this.props.navigation.getParam('website');
    return (
      <View style={styles.container}>
        {address?
          <View style={styles.item}>
            <View style={styles.image}/>
            <Text style={{textAlign: 'center', color: '#F7F7F7', marginTop: 8}}>{address}</Text>
          </View>
        :
          null
        }
        {email?
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=> Linking.openURL('mailto:'+email+'?subject=SendMail&body=Description')}>
            <View style={styles.image}/>
            <Text style={{textAlign: 'center', color: '#F7F7F7', marginTop: 8}}>{email}</Text>
          </TouchableOpacity>
        :
          null
        }
        {phone?
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=> Linking.openURL('tel://07624325404')}>
            <View style={styles.image}/>
            <Text style={{textAlign: 'center', color: '#F7F7F7', marginTop: 8}}>{phone}</Text>
          </TouchableOpacity>
        :
          null
        }
        {website?
          <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={()=> Linking.openURL(website)}>
            <View style={styles.image}/>
            <Text style={{textAlign: 'center', color: '#F7F7F7', marginTop: 8}}>{website}</Text>
          </TouchableOpacity>
        :
          null
        }


      </View>
    );
  }
}

export default ContactEmployer;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth-128,
    alignSelf: 'center'
  },
  image: {
    height: 50,
    width: 50,
    backgroundColor: '#898989'
  }
});
