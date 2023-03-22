import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
const screenWidth = Dimensions.get("window").width;

export default class CustomStatChart extends React.Component {



    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]


        

        return (
            <Layout style={styles.container}>
                <View style={styles.item}>
                    <Text status={this.props.alarms > 0 ? 'danger' : 'basic'} style={styles.count}>
                        {this.props.alarms ? this.props.alarms : 0}
                    </Text>
                    <Text style={styles.title}>Alarms</Text>
                </View>
                <View style={styles.item}>
                    <Text status={this.props.alarms > 0 ? 'warning' : 'basic'} style={styles.count}>
                        {this.props.events ? (this.props.events === 10000 ? '10k+' : this.props.events) : 0}
                    </Text>
                    <Text>Events</Text>
                </View>
                <View style={styles.item}>
                    <Text status={this.props.alarms > 0 ? 'danger' : 'basic'} style={styles.count}>
                        {this.props.alarms ? this.props.alarms : 0}
                    </Text>
                    <Text style={styles.title}>Dark Web</Text>
                </View>
                <View style={styles.item}>
                    <Text status={this.props.alarms > 0 ? 'info' : 'basic'} style={styles.count}>100</Text>
                    <Text style={styles.title}>Courses</Text>
                </View>
            </Layout>
         );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: '1',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        minWidth: 300,
        height: 150,
        maxHeight: 150,
    },
    item: {
        height: 150,
        textAlign: 'center'
    },
    count: {
        fontSize: 50,
    }
});