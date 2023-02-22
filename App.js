import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import our custom theme colors
import { default as theme } from './assets/theme.json'

// import screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';

function Login({navigation, route}) {
  return <LoginScreen navigation={navigation} route={route} />;
}

export const TokenContext = React.createContext();
export const UsmContext = React.createContext();

const Stack = createNativeStackNavigator();

function App() {
  // create state for user token
  const [token, setToken] = React.useState(null);
  const [usmToken, setUsmToken] = React.useState(null);

  // check if token is stored in secure storage
  React.useEffect(() => {
    const getToken = async () => {
      if (Platform.OS !== 'web') {
        const storedToken = await SecureStore.getItemAsync('token');
        const expireTime = await SecureStore.getItemAsync('expireTime');
        const storedUsmToken = await SecureStore.getItemAsync('usm-token');
        const usmExpireTime = await SecureStore.getItemAsync('usmExpireTime');

        // check if token is expired
        if (expireTime < Math.floor(Date.now() / 1000) || usmExpireTime < Math.floor(Date.now() / 1000)) {
          // token is expired, remove it
          await SecureStore.deleteItemAsync('token');
          await SecureStore.deleteItemAsync('expireTime');
          await SecureStore.deleteItemAsync('usm-token');
          await SecureStore.deleteItemAsync('usmExpireTime');
        } else {
          // token is valid, set it
          setToken(storedToken);
          setUsmToken(storedUsmToken);
        }
      } else {
        const storedToken = await AsyncStorage.getItem('token');
        const expireTime = await AsyncStorage.getItem('expireTime');
        const storedUsmToken = await AsyncStorage.getItem('usm-token');
        const usmExpireTime = await AsyncStorage.getItem('usmExpireTime');

        // check if token is expired
        if (expireTime < Math.floor(Date.now() / 1000) || usmExpireTime < Math.floor(Date.now() / 1000)) {
          // token is expired, remove it
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('expireTime');
          await AsyncStorage.removeItem('usm-token');
          await AsyncStorage.removeItem('usmExpireTime');
        } else {
          // token is valid, set it
          setToken(storedToken);
          setUsmToken(storedUsmToken);
        }
      }
    };
    getToken();
  }, []);

    return (
      <TokenContext.Provider value={{ token, setToken }}>
      <UsmContext.Provider value={{ usmToken, setUsmToken }}>
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style="dark" />
        <ApplicationProvider {...eva} theme={{...eva.dark, ...theme}}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {(token === null || usmToken === null) ? (
              // no token found, user isn't signed in
              <Stack.Screen name="login" component={Login} />
            ) : (
              // user is signed in
              <Stack.Screen name="dashboard" component={DashboardScreen} />
            )}
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
      </UsmContext.Provider>
      </TokenContext.Provider>
    );
}

export default App;