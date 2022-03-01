/**
 * Bootstap component
 * @format
 */

import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Connections } from './components/connection';
import { Blocks } from './components/blocks';
import { AppHeader } from './components/app-header';

const Stack = createNativeStackNavigator();

const App = () => {
  
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="BConnection"
        screenOptions={{
          header:(props) => <AppHeader {...props} />
        }}>
        <Stack.Screen name="BConnection" component={Connections} options={{ title: 'Connect to device' }} />
        <Stack.Screen name="Discovery" component={Blocks} options={{ title: 'Discovered Blocks' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
