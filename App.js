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
import OauthScreen from './screens/OauthScreen';

// create context for token
import { TokenContext } from './contexts/tokenContext';

function Login({navigation, route}) {
  return <LoginScreen navigation={navigation} route={route} />;
}


export const UsmContext = React.createContext();

const Stack = createNativeStackNavigator();

function App() {
  // create state for user token
  const [token, setToken] = React.useState(null);

  // check if token is stored in secure storage
  React.useEffect(() => {
    const getToken = async () => {
      if (Platform.OS !== 'web') {
        const storedToken = await SecureStore.getItemAsync('token');
        const expireTime = await SecureStore.getItemAsync('expireTime');

        // check if token is expired
        if (expireTime < Math.floor(Date.now() / 1000)) {
          // token is expired, remove it
          await SecureStore.deleteItemAsync('token');
          await SecureStore.deleteItemAsync('expireTime');
        } else {
          // token is valid, set it
          setToken(storedToken);
        }
      } else {
        const storedToken = await AsyncStorage.getItem('token');
        const expireTime = await AsyncStorage.getItem('expireTime');

        // check if token is expired
        if (expireTime < Math.floor(Date.now() / 1000)) {
          // token is expired, remove it
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('expireTime');
        } else {
          // token is valid, set it
          setToken(storedToken);
        }
      }
    };
    getToken();
  }, []);

    return (
      <TokenContext.Provider value={{ token, setToken }}>
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style="light" />
        <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
            {(token === null) ? (
              <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="login">
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="oauth" component={OauthScreen} />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="dashboard" component={DashboardScreen} />
              </Stack.Navigator>
            )}
        </ApplicationProvider>
      </NavigationContainer>
      </TokenContext.Provider>
    );
}

export default App;