import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Text, Layout, Card, Input, Button, Divider, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery, exchangeCodeAsync, AccessTokenRequest } from 'expo-auth-session';
import { TokenContext, UsmContext } from '../App';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// authentication via Azure AD
WebBrowser.maybeCompleteAuthSession();


const loginHeader = (props) => (
    <Text {...props} category='h6'>
    Login using organization email.
    </Text>
  );

  const AzureIcon = (props) => (
    <Icon name='wifi' {...props} />
  );

  // app keys
  const clientId = '94a4d08f-e078-45f2-a42a-ceb9ad7439ec';
  // USM API credntials. Replace with your own.
  const usmCredentials = "user:secret";

  export default function LoginScreen() {

    const usmEndpoint = 'http://localhost:3000/api/2.0';

    const { token, setToken } = React.useContext(TokenContext);
    const { usmToken, setUsmToken } = React.useContext(UsmContext);

    // make post request to usm endpoint with basic auth to get token
    const usmLogin = async () => {
        const response = await fetch(usmEndpoint + '/oauth/token?grant_type=client_credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '  + btoa(usmCredentials)
            }
        });
        const data = await response.json();
        console.log(data);
        // get current unix time
        const issuedAt = Math.floor(Date.now() / 1000);
        // store usm token
        if (Platform.OS !== 'web') {
            SecureStore.setItemAsync('usm-token', data.access_token);
            SecureStore.setItemAsync('usmExpireTime', issuedAt + data.expire_in);
            // set usm token
            setUsmToken(data.access_token);
        } else {
            await AsyncStorage.setItem('usm-token', data.access_token);
            await AsyncStorage.setItem('usmExpireTime', issuedAt + data.expire_in);
            // set usm token
            setUsmToken(data.access_token);
        }
    };

    // create email
    const [email, setEmail] = React.useState('');
    
    const discovery = useAutoDiscovery('https://login.microsoftonline.com/0d9acab6-2b9d-4883-8617-f3fdea4b02d6/v2.0');

    // build request
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            scopes: [
                'openid',
                'profile',
                'offline_access',
                'email',
                'User.Read'
            ],
            redirectUri: makeRedirectUri({
                scheme: 'com.cyproteck.cyproteck',
                path: 'login'
            }),
            usePKCE: true
        },
        discovery
    );

    // handle response
    React.useEffect(() => {
        const getCodeExchange = async (code) => {
            const tokenResult = await exchangeCodeAsync(
                {
                    code: code,
                    clientId: clientId,
                    redirectUri: makeRedirectUri({
                        scheme: 'com.cyproteck.cyproteck',
                        path: 'login'
                    }),
                    extraParams: {
                        code_verifier: request.codeVerifier
                    }
                },
                discovery
            )

            const { accessToken, refreshToken, issuedAt, expiresIn } = tokenResult;
            console.log(accessToken, refreshToken, issuedAt, expiresIn);
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
            console.log(response);
            // exchange code for session
            getCodeExchange(response.params.code);
        }

         // call usmLogin
        usmLogin();
    }, [response]);

        return (
            <SafeAreaView style={{ flex: 1}}>
                <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text category='h1'>Cyproteck</Text>
                    <Card header={loginHeader}>
                        <Input
                            value={email}
                            label='Email'
                            placeholder='email@example.com'
                            textContentType='emailAddress'
                            autoCompleteType='email'
                            keyboardType='email-address'
                            onChangeText={nextValue => setEmail(nextValue)}
                        />
                        <Button
                        title='Login'
                        disabled={!request}
                        onPress={() => {
                            promptAsync();
                        }}
                        >
                            Login
                        </Button>
                    </Card>
                </Layout>
            </SafeAreaView>
          );
    };
