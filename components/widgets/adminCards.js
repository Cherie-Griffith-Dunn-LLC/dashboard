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

export class AlarmsCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: 0</Text>
                    <Text>No data</Text>
                    <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: {this.props.data.page.totalElements}</Text>
                    <CustomPieChart data={this.props.data._embedded.alarms} />
                    <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
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
                    <Text>No data</Text>
                    <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Events</Text>
                    <Text>Total Events: {this.props.data.page.totalElements}</Text>
                    <CustomLineChart data={this.props.data._embedded.eventResources} />
                    <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
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
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: 0</Text>
                    <Text>No data</Text>
                    <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: {this.props.data.page.totalElements}</Text>
                    <CustomPieChart data={this.props.data._embedded.alarms} />
                    <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
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