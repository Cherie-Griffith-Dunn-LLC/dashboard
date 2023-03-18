import React from 'react';
import { StyleSheet, View, Platform, ImageBackground, Image } from 'react-native';
import { Text, Layout, Card, Input, Button, Tooltip, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTenantId } from '../services/azureApi';
import GlobalStyles from '../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';


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
            style={[GlobalStyles.input, styleguideUIcomponents1Styles.input]}
            onChangeText={nextValue => setEmail(nextValue)}
        />
    );

        return (
            <SafeAreaView style={{ flex: 1 }}>
              <LinearGradient
                  colors={['rgba(34,160,233,1)', 'rgba(0,0,0,1)']}
                  locations={[0, 0.4]}
                  style={styleguideUIcomponents1Styles.background}
                  />
                <Layout style={styleguideUIcomponents1Styles.container}>
                        <View style={styleguideUIcomponents1Styles.loginLeftCard}>
                            <ImageBackground
                        imageStyle={styleguideUIcomponents1Styles.BackSecondImage}
                        style={{flex: 1}}
                        source={require('../assets/backgrounds/login_lock_graphic.png')}
                        >
                                <Image source={require('../assets/cyplogo-wht.png')} style={styleguideUIcomponents1Styles.logo} />
                                <Text category='c1' style={styleguideUIcomponents1Styles.leftFooter}>
                                Don't have an account? Sign Up.
                                </Text>
                            </ImageBackground>
                        </View>
                        <View
                        style={styleguideUIcomponents1Styles.loginRightCard}
                        >
                            <Text status='info' category='h6' style={{textAlign: 'left', marginTop: 40}}>
                            Welcome back,
                            </Text>
                            <Text status='info' category='h6' style={{textAlign: 'left'}}>
                            Log in to continue
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
                            status='info'
                            style={[GlobalStyles.button, styleguideUIcomponents1Styles.button]}
                            onPress={() => {
                                login(email);
                            }}
                            >
                                Login
                            </Button>
                            <Text category='c1' style={styleguideUIcomponents1Styles.rightFooter}>
                            Need help? Contact support
                            </Text>
                        </View>
                </Layout>
            </SafeAreaView>
          );
    };


    const styleguideUIcomponents1Styles = StyleSheet.create({
          BackImage: {
            flex: 1,
            resizeMode: 'cover'
          },
          BackSecondImage: {
            resizeMode: 'contain',
            borderBottomLeftRadius: '20px'
          },
          logo: {
            height: '40px',
            width: '265px',
            marginTop: 50,
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
            textAlign: 'center',
            borderBottomLeftRadius: '20px'
        },
        loginRightCard: {
            maxWidth: '45%',
            width: 300,
            minWidth: 200,
            height: 400,
            backgroundColor: 'white',
            textAlign: 'center',
            padding: 25,
            borderTopRightRadius: '20px'
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
        background: {
          flex: 1,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
        input: {
          marginTop: 15
        },
        button: {
          marginTop: 15
        },
        leftFooter: {
          position: 'absolute',
          bottom: 5,
          left: 70
        },
        rightFooter: {
          position: 'absolute',
          bottom: 5,
          left: 70
        }
      })
      