import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Layout } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginHeader = (props) => (
    <Text {...props} category='h6'>
    Enter login credentials below, or create an account if you don't have one.
    </Text>
  );

  export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginResponse: null,
            isLoading: false,
        };
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1}}>
                <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Login Screen</Text>
                </Layout>
            </SafeAreaView>
          );
    
        }
    }
