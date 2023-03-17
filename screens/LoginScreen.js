import React from 'react';
import { StyleSheet, View, Platform, ImageBackground, Image } from 'react-native';
import { Text, Layout, Card, Input, Button, Tooltip, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
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
                navigation.navigate('OAuth', { tenantId: tenantId });
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
            autoComplete='email'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            onChangeText={nextValue => setEmail(nextValue)}
        />
    );

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../assets/cyplogo-blk.png')} style={styleguideUIcomponents1Styles.logo} />
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


    const styleguideUIcomponents1Styles = StyleSheet.create({
        Input: {
            color: '#d9e1e7',
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 1,
            lineHeight: 1.22,
          },
          Button: {
            margin: '3.94 1.31',
            height: '33.33%',
            color: '#ffffff',
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 1.13,
            lineHeight: 1.37,
          },
          BackImage: {
            flex: 1,
            justifyContent: 'center',
            resizeMode: 'cover'
          },
          logo: {
            height: '40px',
            width: '265px'
          }
      })
      