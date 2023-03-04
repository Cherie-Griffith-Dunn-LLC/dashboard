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

    // create error & tooltip
    const [error, setError] = React.useState(null);
    const [errorVisible, setErrorVisible] = React.useState(false);
    


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
                setError(res.error);
                setErrorVisible(true);
                console.log(res.error);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const renderInputEmail = () => (
        <Input
            value={email}
            label='Email'
            placeholder='email@example.com'
            textContentType='emailAddress'
            autoCompleteType='email'
            keyboardType='email-address'
            onChangeText={nextValue => setEmail(nextValue)}
        />
    );

        return (
            <SafeAreaView style={{ flex: 1}}>
                <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text category='h1'>Cyproteck</Text>
                    <Card header={loginHeader}>
                    <Tooltip
                    anchor={renderInputEmail}
                    visible={errorVisible}
                    placement='top'
                    onBackdropPress={() => setErrorVisible(false)}>
                        {error}
                    </Tooltip>
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
