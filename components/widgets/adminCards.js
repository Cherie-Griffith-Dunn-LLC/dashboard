import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button, Spinner } from '@ui-kitten/components';
import CustomPieChart from '../charts/pieChart';
import CustomLineChart from '../charts/lineChart';
import CustomBarChart from '../charts/barChart';
import CustomStatChart from '../charts/statChart';

// set IndexPath and return it
// we have to do this since we dont have ts with IndexPath type

var IndexPath = {
    row: 0,
    section: undefined
  };

function setIndexPathRow(row) {
    IndexPath.row = row;
    return IndexPath;
}

// loading component
export class LoadingStatus extends Component {
    render() {
        return (
            <View style={styles.loadingContainer}>
                <Spinner size='giant' status='info' />
                <Text>Loading...</Text>
            </View>
        )
    }
}


// stats card
export class StatsCard extends Component {
    render() {
        return (
            <CustomStatChart
                alarms={this.props.alarms.page?.totalElements}
                events={this.props.events.page?.totalElements}
            />
        )
    }
}


export class AlarmsCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: 0</Text>
                    <LoadingStatus />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(1))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: {this.props.data.page.totalElements}</Text>
                    <CustomPieChart data={this.props.data._embedded.alarms} />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(1))}>View Details</Button>
                </Card>
            );
        }
    }
}

export class EventsCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Events</Text>
                    <Text>Total Events: 0</Text>
                    <LoadingStatus />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Events</Text>
                    <Text>Total Events: {this.props.data.page.totalElements}</Text>
                    <CustomLineChart data={this.props.data._embedded.eventResources} />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
                </Card>
            );
        }
    }
}

export class BehavioralMonitoringCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Dark Web Monitoring</Text>
                    <Text>Total Alarms: 0</Text>
                    <LoadingStatus />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(4))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Dark Web Monitoring</Text>
                    <Text>Total Alarms: {this.props.data.page.totalElements}</Text>
                    <CustomPieChart data={this.props.data._embedded.alarms} />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(4))}>View Details</Button>
                </Card>
            );
        }
    }
}

export class LogManagementCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Learning Management System</Text>
                <Text>Total Required Courses: 100</Text>
                <CustomBarChart />
                <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(setIndexPathRow(3))}>View Details</Button>
            </Card>
        );
    }
}


const styles = StyleSheet.create({
    dashboardCard: {
        flex: 1,
        width: '100%',
        minHeight: 400,
        margin: 10,
        padding: 10,
    },
    Input: {
        borderRadius: 12,
    },
    Button: {
        borderRadius: 15,
        width: 140,
        height: 25,
        marginTop: 10,
        alignSelf: 'center',
    },
    BackImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    logo: {
        height: 40,
        width: 265,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});