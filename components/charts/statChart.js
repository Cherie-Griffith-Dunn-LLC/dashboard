import { Layout, Text, Spinner, Card } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import GlobalStyles from '../../constants/styles';

const screenWidth = Dimensions.get("window").width;


export default class CustomStatChart extends React.Component {



    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]


        

        return (
            <Layout style={styles.container}>
                <Card style={[styles.item, GlobalStyles.card]}>
                    <Text status={this.props.alarms > 0 ? 'danger' : 'basic'} style={styles.count}>
                        {this.props.alarms ? this.props.alarms : <Spinner size='giant' status='info' />}
                    </Text>
                    <Text style={styles.title}>Alarms</Text>
                </Card>
                <Card style={[styles.item, GlobalStyles.card]}>
                    <Text status={this.props.events > 0 ? 'warning' : 'basic'} style={styles.count}>
                        {this.props.events ? (this.props.events === 10000 ? '10k+' : this.props.events) : <Spinner size='giant' status='info' />}
                    </Text>
                    <Text>Events</Text>
                </Card>
                <Card style={[styles.item, GlobalStyles.card]}>
                    <Text status={this.props.alarms > 0 ? 'danger' : 'basic'} style={styles.count}>
                        {this.props.alarms ? this.props.alarms : <Spinner size='giant' status='info' />}
                    </Text>
                    <Text style={styles.title}>Dark Web</Text>
                </Card>
                <Card style={[styles.item, GlobalStyles.card]}>
                    <Text status='success' style={styles.count}>100</Text>
                    <Text style={styles.title}>Courses</Text>
                </Card>
            </Layout>
         );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: '1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: 300,
        height: 150,
        maxHeight: 150,
        marginBottom: 10,
        rowGap: 10,
        columnGap: 10,
    },
    item: {
        height: 150,
        width: 250,
        maxWidth: '25%',
        textAlign: 'center',
    },
    count: {
        fontSize: 50,
    }
});