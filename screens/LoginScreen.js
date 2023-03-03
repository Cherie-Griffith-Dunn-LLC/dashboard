import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Text, Layout, Card, Input, Button, Tooltip, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { getTenantId } from '../services/azureApi';




const loginHeader = (props) => (
    <Text {...props} category='h6'>
    Login using organization email.
    </Text>
  );

  const AzureIcon = (props) => (
    <Icon name='wifi' {...props} />
  );


  export default function LoginScreen({ navigation }) {

    // create email
    const [email, setEmail] = React.useState('');
    


    // login function
    const login = async (userEmail) => {
        // get tenant id from email
        // test@cgdgovsolutions.com
        getTenantId(userEmail) // returns tenant id
            .then((res) => {
                // check if we got an error
                if (!res.error) {
                // get tenant id from email
                const tenantId = res.tenantId;
                navigation.navigate('oauth', { tenantId: tenantId });
                } else {
                // show error
                console.log(res.error);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
                        disabled={!email}
                        onPress={() => {
                            login(email);
                        }}
                        >
                            Login
                        </Button>
                    </Card>
                </Layout>
            </SafeAreaView>
          );
    };
