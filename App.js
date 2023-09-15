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
import { ThemeContext } from './contexts/theme-context';
import * as Sentry from 'sentry-expo';
// import our custom theme colors
import { default as theme } from './assets/theme.json';
import { default as mapping } from './assets/mapping.json';
// import screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import OauthScreen from './screens/OauthScreen';

// create context for token
import { TokenContext } from './contexts/tokenContext';

// set up sentry
Sentry.init({
  dsn: 'https://12eef28bf24c483e98e6a9b2aeaf2e24@o4505110341812224.ingest.sentry.io/4505143868129280',
  environment: process.env.MY_ENVIRONMENT === 'production' ? 'production' : 'development',
  // if true all dev/local errors will be ignored and only app releases will report errors to Sentry
  enableInExpoDevelopment: true,
  // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  debug: process.env.MY_ENVIRONMENT === 'production' ? false : true,
  // performance monitoring
  // set to lower value when high traffic
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
});

function Login({navigation, route}) {
  return <LoginScreen navigation={navigation} route={route} />;
}


export const UsmContext = React.createContext();

const Stack = createNativeStackNavigator();

function App() {
  // create state for user token
  const [token, setToken] = React.useState(null);

  // theme state
  const [themeMode, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

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
      <NavigationContainer documentTitle={{
        formatter: (options, route) => `CYPROTECK® - ${options?.title ?? route?.name}`
      }} >
        <IconRegistry icons={EvaIconsPack} />
        <StatusBar style="light" />
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
          <ApplicationProvider {...eva} theme={{...eva[themeMode], ...theme}} customMapping={mapping}>
              {(token === null) ? (
                <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="login">
                  <Stack.Screen options={{title: "Account Login"}} name="Login" component={Login} />
                  <Stack.Screen name="OAuth" component={OauthScreen} />
                </Stack.Navigator>
              ) : (
                <Stack.Navigator screenOptions={{headerShown: false}}>
                  <Stack.Screen name="Dashboard" component={DashboardScreen} />
                </Stack.Navigator>
              )}
          </ApplicationProvider>
        </ThemeContext.Provider>
      </NavigationContainer>
      </TokenContext.Provider>
    );
}

export default App;