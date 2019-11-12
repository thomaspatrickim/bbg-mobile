import React, { Component } from "react"
import { View, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Linking, Image, Animated, FlatList } from "react-native";
import Swiper from 'react-native-swiper';
// Component size relative to the screen's dimensions
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class ViewBusiness extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentImg: 1,
      nextOpacity: new Animated.Value(1),
      prevOpacity: new Animated.Value(0.3),
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title')
    }
  }
  renderContent = ({ item }) => {
    return (
      <View style={styles.section}>
        <Text style={{color: '#D09138', fontSize: 18, marginBottom: 8}}>{item.heading}</Text>
        <Text style={{color: '#686868', lineHeight: 20, fontWeight: 'normal'}}>{item.body}</Text>
      </View>
    );
  }
  renderOpeningHours = ({ item }) => {
    return (
      <View style={styles.hours_item}>
        <Text style={{color:'#686868'}}>{item.label}</Text>
        <Text style={{color:'#686868'}}>{item.period}</Text>
      </View>
    );
  }

  render(){
    const business = this.props.navigation.getParam('business');
    const subcategories = this.props.navigation.getParam('subcategories');

    this.scrollY = new Animated.Value(0);

    var listMoveHeight = -200;

    var listMov = this.scrollY.interpolate({
      inputRange: [-180, 0, 150],
      outputRange: [0, 0, -150],
      extrapolate: 'clamp',
    });

    let header = <View style={styles.header}>
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
          {business.imageUrls.map((image, imageIdx) => {
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
          <Text style={{color: '#DCDCDC', fontSize: 18, marginBottom: 8}} >{business.name}</Text>
          <Text style={{color: '#898989'}}>{subcategories}</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={()=> this.props.navigation.navigate('ContactBusiness', {address: business.address, email: business.email, phone: business.phone})}>
            <Text style={{color: '#898989'}}>Contact</Text>
          </TouchableOpacity>
          {business.websiteUrl ?
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={()=> Linking.openURL(business.websiteUrl)}>
              <Text style={{color: '#898989'}}>Website</Text>
            </TouchableOpacity>
          :
            null
          }
        </View>
      </View>
    </View>

    return (
      <ScrollView style={styles.container}>
        {header}
        <View style={styles.content}>
          <FlatList
            data={business.content}
            renderItem={this.renderContent}
            keyExtractor={(item, index) => index.toString()}
          />
          {business.opening.display == true ?
            <View style={styles.hours}>
              <Text style={{color: '#D09138', fontSize: 18, marginBottom: 8, marginLeft: 16}}>Hours</Text>
              <FlatList
                data={business.opening.days}
                renderItem={this.renderOpeningHours}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          :
            null
          }
        </View>
      </ScrollView>
    );
  }
}

export default ViewBusiness;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff00',
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
    flex: 4,
    paddingRight: 8,
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
    justifyContent: 'space-around',
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
  hours: {
    flexDirection: 'column'
  },
  hours_item: {
    height: 40,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
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
