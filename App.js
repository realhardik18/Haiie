import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './screens/Profile';
import Feed from './screens/Feed';
import Create from './screens/Create';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Feed" component={Feed} options={{headerShown:false}}/>
        <Tab.Screen name="Create" component={Create} options={{headerShown:false}}/>
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
