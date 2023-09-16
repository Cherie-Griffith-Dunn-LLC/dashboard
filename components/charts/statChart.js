import { Layout, Text, Spinner, Card, IndexPath } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import GlobalStyles from '../../constants/styles';
import { AlarmIcon, EventsIcon, DwmIcon } from '../icons';

const screenWidth = Dimensions.get("window").width;


export default class CustomStatChart extends React.Component {

    



    render() {

        // store screen width
        const screenWidth = Dimensions.get("window").width;

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        const alarmsHeader = (props) => (
            <Text style={styles.header}>THREATS</Text>
        );

        const eventsHeader = (props) => (
            <Text style={styles.header}>SYSTEM ACTIVITY</Text>
        );

        const dwmHeader = (props) => (
            <Text style={styles.header}>FEATURED PARTNER</Text>
        );
        

        return (
            <Layout style={styles.container}>
                <Card
                    onPress={() => {this.props.setSelectedIndex(new IndexPath(1))}}
                    style={[styles.item, GlobalStyles.card, { backgroundColor: '#cf4039' }]}>
                    <Text style={styles.header}>THREATS</Text>
                    <View style={styles.insideContainer}>
                        {screenWidth > 600 ?
                        <View style={styles.icon}>
                            <AlarmIcon style={{height: 32, color: '#cf4039', margin: 10}} fill="#cf4039" />
                        </View>
                        : null}
                        <Text category='h6' status={this.props.alarms > 0 ? 'danger' : 'basic'} style={styles.count}>
                            {Number.isInteger(this.props.alarms) ? this.props.alarms : <Spinner size='giant' status='info' />}
                        </Text>
                    </View>
                </Card>
                <Card
                    onPress={() => {this.props.setSelectedIndex(new IndexPath(2))}}
                    style={[styles.item, GlobalStyles.card, { backgroundColor: '#0b4d80' }]}>
                    <Text style={styles.header}>SYSTEM ACTIVITY</Text>
                    <View style={styles.insideContainer}>
                        {screenWidth > 600 ?
                            <View style={styles.icon}>
                                <EventsIcon style={{height: 32, color: '#0b4d80', marginLeft: 8.5, marginTop: 10}} fill="#0b4d80" />
                            </View>
                        : null}
                        <Text category='h6' style={styles.count}>
                            {Number.isInteger(this.props.events) ? (this.props.events === 10000 ? '10k+' : this.props.events) : <Spinner size='giant' status='info' />}
                        </Text>
                    </View>
                </Card>
                {screenWidth > 600 ?
                <Card
                onPress={() => {this.props.setSelectedIndex(new IndexPath(4))}}
                    style={[styles.item, GlobalStyles.card, { backgroundColor: '#010d27' }]}>
                        <Text style={styles.header}>DARK WEB MONITORING</Text>
                        <View style={styles.insideContainer}>
                            {screenWidth > 600 ?
                                <View style={styles.icon}>
                                    <DwmIcon style={{height: 32, color: '#010d27', margin: 9}} fill='#010d27' />
                                </View>
                                : null}
                            <View>
                                <Text category='h6' status={this.props.dwm > 0 ? 'danger' : 'basic'} style={styles.count}>
                                    {Number.isInteger(this.props.dwm) ? this.props.dwm : <Spinner size='giant' status='info' />}
                                </Text>
                            </View>
                        </View>
                </Card>
            : null}
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
        width: '100%',
        height: 125,
        maxHeight: 125,
        marginBottom: 10,
        rowGap: 10,
        columnGap: 10,
    },
    item: {
        height: 100,
        width: 440,
        maxWidth: '33%',
        minWidth: 125,
        borderColor: 'grey',
        borderWidth: 1,
    },
    insideContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    count: {
        fontSize: 45,
        color: 'white',
        flex: 1
    },
    title: {
        color: 'white',
    },
    header: {
        color: 'white',
    },
    icon: {
        backgroundColor: 'white',
        height: 42,
        width: 42,
        borderRadius: 10,
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 5,
    },
    innerIcon: {
        color: 'black',
        height: 22,
    }
});