import React, { Component } from "react"
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from "react-native";


class AboutScreen extends Component {

  static navigationOptions = {
    title: 'About',
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>RegionSelectScreen</Text>
      </View>
    );
  }
}

export default AboutScreen;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D'
  },
});
