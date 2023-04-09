import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button, IndexPath } from '@ui-kitten/components';
import CustomPieChart from '../charts/pieChart';
import CustomLineChart from '../charts/lineChart';
import CustomBarChart from '../charts/barChart';


export class UserAlertsCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: 0</Text>
                    <Text>No data</Text>
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(new IndexPath(1))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={styles.dashboardCard}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: {this.props.data.page.totalElements}</Text>
                    <CustomPieChart data={this.props.data._embedded.alarms} />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(new IndexPath(1))}>View Details</Button>
                </Card>
            );
        }
    }
}

export class UserCoursesCard extends Component {
    render() {
        return (
            <Card style={styles.dashboardCard}>
                <Text category='h6'>Learning Management System</Text>
                <Text>Total Required Courses: 100</Text>
                <CustomBarChart />
                <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(new IndexPath(2))}>View Details</Button>
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
        minHeight: 400
    },
    Input: {
        borderRadius: '12px'
      },
      Button: {
        borderRadius: '15px',
        width: '140px',
        height: '25px'
      },
      BackImage: {
        flex: 1,
        resizeMode: 'cover'
      },
      logo: {
        height: '40px',
        width: '265px'
      }
});