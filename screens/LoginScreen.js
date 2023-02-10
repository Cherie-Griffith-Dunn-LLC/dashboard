import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Layout, Card, Input, Button, Divider, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';

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

  export default function LoginScreen() {
    
    const discovery = useAutoDiscovery('https://login.microsoftonline.com/0d9acab6-2b9d-4883-8617-f3fdea4b02d6/v2.0');

    // build request
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '94a4d08f-e078-45f2-a42a-ceb9ad7439ec',
            scopes: [
                'openid',
                'profile',
                'offline_access',
                'email'
            ],
            redirectUri: makeRedirectUri({
                // change this to our own redirect URI
                scheme: 'cyproteckredirect'
            }),
        },
        discovery
    );
        return (
            <SafeAreaView style={{ flex: 1}}>
                <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text category='h1'>Cyproteck</Text>
                    <Card header={loginHeader}>
                        <Input
                            value=''
                            label='Email'
                            placeholder='email@example.com'
                            textContentType='emailAddress'
                            autoCompleteType='email'
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
