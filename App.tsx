/**
 * Bootstap component
 * @format
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Connections } from './components/connection';
import { Blocks } from './components/blocks';
import { AppHeader } from './components/app-header';

const RootStack = createNativeStackNavigator();

const App = () => {
  return (
    <RootStack.Navigator
      initialRouteName="BConnection"
      screenOptions={{
        header: (props) => <AppHeader {...props} />
      }}>
      <RootStack.Screen name="BConnection" component={Connections} options={{ title: 'Connect to device' }} />
      <RootStack.Screen name="Discovery" component={Blocks} options={{ title: 'Discovered Blocks' }} />
    </RootStack.Navigator>
  );
};

export default App;
