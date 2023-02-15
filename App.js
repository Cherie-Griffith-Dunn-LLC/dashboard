import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance, useColorScheme, Platform } from 'react-native';
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

const Stack = createNativeStackNavigator();

function App() {
  // create state for user token
  const [token, setToken] = React.useState(null);

  // check if token is stored in secure storage
  React.useEffect(() => {
    const getToken = async () => {
      if (Platform.OS !== 'web') {
        const storedToken = await SecureStore.getItemAsync('token');
        setToken(storedToken);
      } else {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      }
    };
    getToken();
  }, []);

  const colorScheme = useColorScheme();
  // use system color scheme for dark or light mode
  // changes made must be done for both dark and light mode
  if (colorScheme === 'dark') {
    return (
      <TokenContext.Provider value={{ token, setToken }}>
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style="dark" />
        <ApplicationProvider {...eva} theme={{...eva.dark, ...theme}}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {token === null ? (
              // no token found, user isn't signed in
              <Stack.Screen name="login" component={Login} />
            ) : (
              // user is signed in
              <Stack.Screen name="dashboard" component={DashboardScreen} />
            )}
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
      </TokenContext.Provider>
    );
  } else {
    return (
      <TokenContext.Provider value={{ token, setToken }}>
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style="light" />
        <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {token === null ? (
              // no token found, user isn't signed in
              <Stack.Screen name="login" component={Login} />
            ) : (
              // user is signed in
              <Stack.Screen name="dashboard" component={DashboardScreen} />
            )}
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
      </TokenContext.Provider>
    );
  }
}

export default App;