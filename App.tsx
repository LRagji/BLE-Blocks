/**
 * Bootstap component
 * @format
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchDevices } from './src/screens/search-devices';
import { DeviceServices } from './src/screens/device-services';
import { AppHeader } from './src/components/app-header';

const RootStack = createNativeStackNavigator();

const App = () => {
  return (
    <RootStack.Navigator
      initialRouteName="BConnection"
      screenOptions={{
        header: (props) => <AppHeader {...props} />
      }}>
      <RootStack.Screen name="search-devices" component={SearchDevices} options={{ title: 'Search devices' }} />
      <RootStack.Screen name="device-services" component={DeviceServices} options={{ title: 'Discover services' }} />
    </RootStack.Navigator>
  );
};

export default App;
