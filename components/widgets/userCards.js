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

export class UserAlertsCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Alerts</Text>
                <Text>Total Alerts: 5</Text>
                <CustomLineChart />
                <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(1))}>View Details</Button>
            </Card>
        );
    }
}

export class UserCoursesCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Courses</Text>
                <Text>Required Courses: 5</Text>
                <CustomBarChart />
                <Button onPress={() => this.props.setSelectedIndex(setIndexPathRow(2))}>View Details</Button>
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