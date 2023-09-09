import React from 'react';
import { StyleSheet, View, Platform, Image } from 'react-native';
import { Text, Layout, Card, Button, Divider, Icon, Spinner } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery, exchangeCodeAsync, AccessTokenRequest } from 'expo-auth-session';
import { TokenContext } from '../contexts/tokenContext';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';

// msal imports
import PublicClientApplication from 'react-native-msal';

// authentication via Azure AD
WebBrowser.maybeCompleteAuthSession();

const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner status='basic' size='small'/>
    </View>
  );

const loginHeader = (props) => (
    <Text {...props} category='h6'>
    Login using organization email.
    </Text>
  );
  const logo = (props) => (
    <Image {...props} source={require('../assets/cyplogo-blk.png')} style={styles.logo} />
  );
  const AzureIcon = (props) => (
    <Icon name='wifi' {...props} />
  );

  // app keys
  const clientId = '1d40f6b3-9072-4a0a-af48-6e423e58d0d6';


  // msal config
  const config = {
    auth: {
      clientId: 'acb25fbc-4413-4920-b5f1-04ce0e49fc86',
      // This authority is used as the default in `acquireToken` and `acquireTokenSilent` if not provided to those methods.
      // Defaults to 'https://login.microsoftonline.com/common'
      // authority: 'https://<authority url>',
      // redirect
      redirectUri: Platform.select({
        android: 'msauth://com.cyproteck.cyproteck/chGHORtE8XSnHOWZJryjlVX3zmU%3D', // ex: "msauth://com.package/Xo8WBi6jzSxKDVR4drqm84yr9iU%3D"
        web: 'http://localhost:19006/', // ex: "https://login.microsoftonline.com/common/oauth2/nativeclient"
        default: 'https://app.cyproteck.com/',
      }),
    },
  };

    // msal scopes
    const scopes = [
      'openid',
      'offline_access'
    ];

    
  export default function OauthScreen({ route, navigation }) {

    const { token, setToken } = React.useContext(TokenContext);

    // init public client app async
    const pca = new PublicClientApplication(config);
   
    React.useEffect(() => {
      try {
        pca.init();
      } catch (error) {
        console.error('Error initializing the pca, check your config.', error);
      }
  
      // Acquiring a token for the first time, you must call pca.acquireToken
      const params = { scopes };
      pca.acquireToken(params).then((response) => {
        console.log(response);
        const accessToken = response.accessToken;
        // get the expire time then convert to unix timestamp
        const expiresOn = response.expiresOn / 1000;
        // store the token
      if (Platform.OS !== 'web') {
          SecureStore.setItemAsync('token', accessToken);
          SecureStore.setItemAsync('expireTime', expiresOn);
          setToken(accessToken);
      } else {
          AsyncStorage.setItem('token', accessToken);
          AsyncStorage.setItem('expireTime', expiresOn);
          setToken(accessToken);
      }
      }).catch((error) => {
        console.error('Error: ', error);
      });
      
    }, [pca]);

    // create auto discovery
    //const [discovery, setDiscovery] = React.useState(null);

    const discovery = useAutoDiscovery(`https://login.microsoftonline.com/${route.params.tenantId}/v2.0`);
            
            
     // build request
     const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            scopes: [
                'openid',
                'profile',
                'offline_access',
                'email',
                'Directory.AccessAsUser.All',
                'User.Read'
            ],
            redirectUri: makeRedirectUri({
                scheme: 'com.cyproteck.cyproteck',
                path: '/'
            }),
            usePKCE: true
        },
        discovery
    );

    // prompt for login
    // React.useEffect(() => {
    //     if (request) {
    //         promptAsync();
    //     }
    // }, [request]);

    // handle response
    React.useEffect(() => {
        const getCodeExchange = async (code) => {
            const tokenResult = await exchangeCodeAsync(
                {
                    code: code,
                    clientId: clientId,
                    redirectUri: makeRedirectUri({
                        scheme: 'com.cyproteck.cyproteck',
                        path: '/'
                    }),
                    extraParams: {
                        code_verifier: request.codeVerifier
                    }
                },
                discovery
            )

            const { accessToken, refreshToken, issuedAt, expiresIn } = tokenResult;
            // store the token
            if (Platform.OS !== 'web') {
                SecureStore.setItemAsync('token', accessToken);
                SecureStore.setItemAsync('expireTime', issuedAt + expiresIn);
                setToken(accessToken);
            } else {
                await AsyncStorage.setItem('token', accessToken);
                await AsyncStorage.setItem('expireTime', issuedAt + expiresIn);
                setToken(accessToken);
            }
        }
        if (response?.type === 'success') {
            // exchange code for session
            getCodeExchange(response.params.code);
        }
    }, [response]);

        return (
            <SafeAreaView style={{ flex: 1}}>
                <LinearGradient
                  colors={['rgba(34,160,233,1)', 'rgba(0,0,0,1)']}
                  locations={[0, 0.4]}
                  style={styles.background}
                  />
                <Layout style={styles.container}>
                    <Card header={logo} style={[GlobalStyles.card, styles.card]}>
                        <Text category='p1'>Please login using your Microsoft Organization account in the popup. You will be redirected automatically.</Text>
                        <Divider style={{ marginVertical: 10 }} />
                        <Button accessoryLeft={LoadingIndicator} status='danger' style={[GlobalStyles.button, styles.button]} onPress={() => navigation.navigate('Login')}>Cancel</Button>
                    </Card>
                </Layout>
            </SafeAreaView>
          );
    };

    const styles = StyleSheet.create({
        BackImage: {
          flex: 1,
          resizeMode: 'cover'
        },
        logo: {
            height: '40px',
            width: '265px',
            marginTop: 15,
            marginBottom: 30,
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        card: {
            maxWidth: '90%',
            width: 400,
            minWidth: 300,
            height: 500,
            backgroundColor: 'white',
            textAlign: 'center',
            borderRadius: 0,
            padding: 25
        },
      indicator: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      background: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      container: {
        display: 'flex',
        flex: '2',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: '200px',
        backgroundColor: 'rgba(255,255,255,0)'
      },
      button: {
        marginTop: 50
      }
    })