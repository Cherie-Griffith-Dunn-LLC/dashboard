import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button } from '@ui-kitten/components';
import CustomPieChart from '../charts/pieChart';
import CustomLineChart from '../charts/lineChart';
import CustomBarChart from '../charts/barChart';

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

export class ThreatDetectionCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Alarms</Text>
                <Text>Total Alarms: 12</Text>
                <CustomPieChart />
                <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(1))} >View Details</Button>
            </Card>
        );
    }
}

export class VulnScanCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Events</Text>
                <Text>Total Events: 7</Text>
                <CustomLineChart />
                <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
            </Card>
        );
    }
}

export class BehavioralMonitoringCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Dark Web Monitoring</Text>
                <Text>Total Dark Web Alerts: 5</Text>
                <CustomPieChart />
                <Button>View Details</Button>
            </Card>
        );
    }
}

export class LogManagementCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Learning Management System</Text>
                <Text>Total Required Courses: 100</Text>
                <CustomBarChart />
                <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(3))}>View Details</Button>
            </Card>
        );
    }
}



const styles = StyleSheet.create({
    dashboardCard: {
        maxWidth: '45%',
        width: 500,
        minWidth: 300,
        height: 400,
    }
});