import React from 'react';
import { StyleSheet, View, Platform, ImageBackground, Image } from 'react-native';
import { Text, Layout, Card, Input, Button, Tooltip, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTenantId } from '../services/azureApi';
import GlobalStyles from '../constants/styles';



const loginHeader = (props) => (
    <Text {...props} category='p1' style={{textAlign: 'center'}}>
    Login using organization email.
    </Text>
  );

  const loginFooter = (props) => (
    <Text {...props} category='c1' style={{textAlign: 'center'}}>
    Don't have an account? Sign Up.
    </Text>
  );

  const logo = (props) => (
    <Image {...props} source={require('../assets/cyplogo-blk.png')} style={styleguideUIcomponents1Styles.logo} />
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
            style={GlobalStyles.input}
            onChangeText={nextValue => setEmail(nextValue)}
        />
    );

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground
                    imageStyle={styleguideUIcomponents1Styles.BackImage}
                    style={{flex: 1}}
                    source={require('../assets/backgrounds/waves.png')}
                    >
                <Layout style={{ display: 'flex', flex: '2', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingTop: '200px' }}>
                        <View style={styleguideUIcomponents1Styles.loginLeftCard}>
                        <Image source={require('../assets/cyplogo-blk.png')} style={styleguideUIcomponents1Styles.logo} />
                        </View>
                        <View
                        style={styleguideUIcomponents1Styles.loginRightCard}
                        >
                            <Text category='p1' style={{textAlign: 'center'}}>
                            Login using organization email.
                            </Text>
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
                            style={GlobalStyles.button}
                            onPress={() => {
                                login(email);
                            }}
                            >
                                Login
                            </Button>
                            <Text category='c1' style={{textAlign: 'center'}}>
                            Don't have an account? Sign Up.
                            </Text>
                        </View>
                </Layout>
                </ImageBackground>
            </SafeAreaView>
          );
    };


    const styleguideUIcomponents1Styles = StyleSheet.create({
          BackImage: {
            flex: 1,
            resizeMode: 'cover'
          },
          logo: {
            height: '40px',
            width: '265px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          },
          loginLeftCard: {
            maxWidth: '45%',
            width: 300,
            minWidth: 200,
            height: 400,
            backgroundColor: 'white',
            borderBottomLeftRadius: '15px',
            textAlign: 'center'
        },
        loginRightCard: {
            maxWidth: '45%',
            width: 300,
            minWidth: 200,
            height: 400,
            backgroundColor: 'white',
            borderTopRightRadius: '15px',
            textAlign: 'center'
        }
      })
      