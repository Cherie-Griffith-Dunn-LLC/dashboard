import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button } from '@ui-kitten/components';
import CustomPieChart from '../charts/pieChart';
import CustomLineChart from '../charts/lineChart';
import CustomBarChart from '../charts/barChart';

export class ThreatDetectionCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Threat Detection</Text>
                <Text>Total Threats: 12</Text>
                <CustomPieChart />
                <Button>View Details</Button>
            </Card>
        );
    }
}

export class VulnScanCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Vulnerability Scanning</Text>
                <Text>Total Vulnerabilities: 7</Text>
                <CustomLineChart />
                <Button>View Details</Button>
            </Card>
        );
    }
}

export class BehavioralMonitoringCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Behavioral Monitoring</Text>
                <Text>Total Alerts: 5</Text>
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
                <Text category='h6'>Log Management</Text>
                <Text>Total Logs: 100</Text>
                <CustomBarChart />
                <Button>View Details</Button>
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