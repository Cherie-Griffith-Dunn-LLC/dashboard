import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button, Spinner, IndexPath } from '@ui-kitten/components';
import CustomPieChart from '../charts/pieChart';
import CustomLineChart from '../charts/lineChart';
import CustomBarChart from '../charts/barChart';
import CustomStatChart from '../charts/statChart';

import GlobalStyles from '../../constants/styles';

// loading component
export class LoadingStatus extends Component {
    render() {
        return (
            <Text>
                <Spinner size='giant' status='info' />
                Loading...
            </Text>
        )
    }
}

export class UserAlertsCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={[styles.topCard, GlobalStyles.card]}>
                    <Text category='h6'>Alerts</Text>
                    <Text>Total Alerts: 0</Text>
                    <LoadingStatus />
                    <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(new IndexPath(1))}>View Details</Button>
                </Card>
            );
        } else {
            return (
                <Card style={[styles.topCard, GlobalStyles.card]}>
                    <Text category='h6'>Alerts</Text>
                    <Text>Total Alerts: {this.props.data._embedded.alarms?.length}</Text>
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
            <Card style={[styles.topCard, GlobalStyles.card]}>
                <Text category='h6'>Learning Management System</Text>
                <Text>Total Required Courses: 100</Text>
                <CustomBarChart />
                <Button status='info' style={styles.Button} onPress={() => this.props.setSelectedIndex(new IndexPath(2))}>View Details</Button>
            </Card>
        );
    }
}






const styles = StyleSheet.create({
    trainingCard: {
        maxWidth: '100%',
        width: '100%',
        minWidth: 300,
        minHeight: 400,
        borderColor: '#CED1D5',
        borderWidth: 1,
    },
    topCard: {
        maxWidth: '90%',
        width: 500,
        minWidth: '48%',
        height: 400,
        minHeight: 400,
        borderColor: '#CED1D5',
        borderWidth: 1,
    },
    bottomCard: {
        maxWidth: '100%',
        width: 500,
        minWidth: '48%',
        height: 200,
        minHeight: 150,
        borderColor: '#CED1D5',
        borderWidth: 1,
    },
    Input: {
        borderRadius: '12px'
      },
      Button: {
        borderRadius: '15px',
        width: '140px',
        height: '25px',
        alignSelf: 'center'
      },
      BackImage: {
        flex: 1,
        resizeMode: 'cover'
      },
      logo: {
        height: '40px',
        width: '265px'
      },
      totalNumbers: {
        fontSize: 40,
      }
});