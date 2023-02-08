import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { Appearance, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// import screens
import  LoginScreen  from './screens/LoginScreen';

function Login({navigation, route}) {
  return <LoginScreen navigation={navigation} route={route} />;
}


const Stack = createNativeStackNavigator();

function App() {
  const colorScheme = useColorScheme();
  // use system color scheme for dark or light mode
  // changes made must be done for both dark and light mode
  if (colorScheme === 'dark') {
    return (
      <NavigationContainer>
        <StatusBar style="dark" />
        <ApplicationProvider {...eva} theme={eva.dark}>
          <Stack.Navigator initialRouteName="Login Form" screenOptions={{headerShown: false}}>
            <Stack.Screen name="login" component={Login} />
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
    );
  }
}

export default App;