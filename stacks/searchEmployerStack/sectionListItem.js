import React, { Component, PureComponent} from "react";
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, Text} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

class SectionListItem extends React.PureComponent {
  render(){
    return(
      <TouchableOpacity activeOpacity={0.8} style={{height: 50, backgroundColor: '#1B191A', alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#0D0D0D'}} onPress={() => this.props.navigation.navigate('ViewEmployer', { title: this.props.item.name, slug: this.props.item.slug, locationSlug: this.props.item.location.slug, employer: this.props.item})}>
        <Text style={{ color: '#DCDCDC', width: '90%'}}>{this.props.item.name}</Text>
        <Ionicons name='ios-arrow-forward' size={20} color='#DCDCDC' style={{marginRight: 8, alignSelf: 'flex-end'}}/>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(SectionListItem);
