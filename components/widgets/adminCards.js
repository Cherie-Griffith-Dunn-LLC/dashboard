import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button, Spinner, IndexPath, Layout } from '@ui-kitten/components';
import CustomPieChart from '../charts/pieChart';
import CustomLineChart from '../charts/lineChart';
import CustomBarChart from '../charts/barChart';
import CustomStatChart from '../charts/statChart';

import GlobalStyles from '../../constants/styles';
import { TrainingList } from './trainingList';

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
                <Card style={[styles.topCard, GlobalStyles.card]}>
                    <Text category='h6'>Alarms Summary</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.topCard, GlobalStyles.card]}>
                    <Text category='h6'>Alarms Summary</Text>
                    <CustomPieChart data={this.props.data._embedded?.alarms} />
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
                <Card style={[styles.topCard, GlobalStyles.card]}>
                    <Text category='h6'>Events Tracking</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.topCard, GlobalStyles.card]}>
                    <Text category='h6'>Events Tracking</Text>
                    <CustomLineChart data={this.props.data._embedded?.eventResources} />
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
                <Card style={[styles.bottomCard, GlobalStyles.card]}>
                    <Text category='h6'>Dark Web Monitoring</Text>
                    <Text>Compromised data incidences</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.bottomCard, GlobalStyles.card]}>
                    <Text category='h6'>Dark Web Monitoring</Text>
                    <Text>Total: {this.props.data.page?.totalElements}</Text>
                </Card>
            );
        }
    }
}

export class LogManagementCard extends Component {
    render() {
        return (
            <Card style={[styles.bottomCard, GlobalStyles.card]}>
                <Text category='h6'>Courses Overview</Text>
                <Text>Total Required Courses: 100</Text>
                <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>24 Assigned</Text>
                    <Text>13 In Progress</Text>
                    <Text>11 Completed</Text>
                </Layout>
            </Card>
        );
    }
}

export class EmployeeTrainingCard extends Component {
    render() {
        if (this.props.data.length === 0) {
            return (
                <Card style={[styles.trainingCard, GlobalStyles.card]}>
                    <Text category='h6'>Employee Training</Text>
                    <LoadingStatus />
                </Card>
            )
        } else {
            return (
                <Card style={[styles.trainingCard, GlobalStyles.card]}>
                    <Text category='h6'>Employee Training</Text>
                    <TrainingList data={this.props.data} />
                </Card>
            )
        }
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
      }
});