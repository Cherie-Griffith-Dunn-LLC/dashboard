import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button } from '@ui-kitten/components';
import CustomPieChart from '../components/charts/pieChart';
import CustomLineChart from '../components/charts/lineChart';
import CustomBarChart from '../components/charts/barChart';

export class UserAlertsCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Alerts</Text>
                <Text>Total Alerts: 5</Text>
                <CustomLineChart />
                <Button>View Details</Button>
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