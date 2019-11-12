import React from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthLoadingScreen from './stacks/authLoading';
import RegionSelectScreen from './stacks/regionSelect';

import Trades from './stacks/searchBusinessStack/index';
import Businesses from './stacks/searchBusinessStack/businesses';
import ViewBusiness from './stacks/searchBusinessStack/viewbusiness';
import ContactBusiness from './stacks/searchBusinessStack/contactbusiness';
import BusinessSearchResult from './stacks/searchBusinessStack/searchresult';

import Employers from './stacks/searchEmployerStack/index';
// import Jobs from './stacks/searchEmployerStack/jobs';
import ViewEmployer from './stacks/searchEmployerStack/viewemployer';
import ContactEmployer from './stacks/searchEmployerStack/contactemployer';
import EmployerSearchResult from './stacks/searchEmployerStack/searchresult';

import VoteScreen from './stacks/voteStack/index';

import InfoScreen from './stacks/infoStack/index';
import AboutScreen from './stacks/infoStack/about';
import ContactScreen from './stacks/infoStack/contact';

// Component size relative to the screen's dimensions
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
//Device query here for extra padding for iphone X

const SearchBusinessStack = createStackNavigator(
  {
    Trades: Trades,
    Businesses: Businesses,
    ViewBusiness: ViewBusiness,
    ContactBusiness: ContactBusiness,
    BusinessSearchResult: BusinessSearchResult
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#0D0D0D',
        borderBottomWidth: 1,
        borderBottomColor: '#232323',
      },
      headerTintColor: '#D09138',
      headerTitleStyle: {
        fontWeight: 'normal',
        color: '#D09138'
      },
    })
  }
);

const SearchEmployerStack = createStackNavigator(
  {
    Employers: Employers,
    ViewEmployer: ViewEmployer,
    ContactEmployer: ContactEmployer,
    EmployerSearchResult: EmployerSearchResult
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#0D0D0D',
        borderBottomWidth: 1,
        borderBottomColor: '#232323',
      },
      headerTintColor: '#D09138',
      headerTitleStyle: {
        fontWeight: 'normal',
        color: '#D09138'
      },
    })
  }
);
const VoteStack = createStackNavigator(
  {
    vote: VoteScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({ header: null})
  }
);
const InfoStack = createStackNavigator(
  {
    info: InfoScreen,
    about: AboutScreen,
    contact: ContactScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#0D0D0D',
        borderBottomWidth: 1,
        borderBottomColor: '#232323'
      },
      headerTintColor: '#D09138',
      headerTitleStyle: {
        fontWeight: 'normal',
        color: '#D09138'
      }
    })
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Businesses: SearchBusinessStack,
    Employers: SearchEmployerStack,
    Vote: VoteStack,
    Info: InfoStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Businesses') {
          iconName = `ios-business`;
        } else if (routeName === 'Employers') {
          iconName = `ios-person`;
        } else if (routeName === 'Vote') {
          iconName = `ios-chatbubbles`;
        } else if (routeName === 'Info') {
          iconName = `ios-more`;
        }
        // You can return any component that you like here!
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      keyboardHidesTabBar: true,
      activeTintColor: '#D09138',
      inactiveTintColor: '#7F7F80',
      style: {
        backgroundColor: '#0D0D0D',
        borderTopColor: '#605F60'
      },
    }
  }
);



const App = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    RegionSelect: RegionSelectScreen,
    App: TabNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default App;
