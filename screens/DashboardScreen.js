import React from 'react';
import { Text, Layout, Card, Input, Button, Divider, Icon } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginHeader = (props) => (
    <Text {...props} category='h6'>
    Dashboard screen.
    </Text>
  );


  export default function DashboardScreen() {
        return (
            <SafeAreaView style={{ flex: 1}}>
                <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text category='h1'>Cyproteck</Text>
                    <Card header={loginHeader}>
                    </Card>
                </Layout>
            </SafeAreaView>
          );
    };
