import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button, Spinner, IndexPath, Layout } from '@ui-kitten/components';
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
                <Card style={[styles.dashboardCard, GlobalStyles.card]}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: 0</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.dashboardCard, GlobalStyles.card]}>
                    <Text category='h6'>Alarms</Text>
                    <Text>Total Alarms: {this.props.data.page?.totalElements}</Text>
                    <CustomPieChart data={this.props.data._embedded.alarms} />
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
                <Card style={[styles.dashboardCard, GlobalStyles.card]}>
                    <Text category='h6'>Events</Text>
                    <Text>Total Events: 0</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.dashboardCard, GlobalStyles.card]}>
                    <Text category='h6'>Events</Text>
                    <Text>Total Events: {this.props.data.page?.totalElements}</Text>
                    <CustomLineChart data={this.props.data._embedded.eventResources} />
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
                <Card style={[styles.dashboardCard, GlobalStyles.card]}>
                    <Text category='h6'>Dark Web Monitoring</Text>
                    <Text>Compromised data incidences</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.dashboardCard, GlobalStyles.card]}>
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
            <Card style={[styles.dashboardCard, GlobalStyles.card]}>
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


const styles = StyleSheet.create({
    dashboardCard: {
        maxWidth: '45%',
        width: 500,
        minWidth: 300,
        height: 400,
        minHeight: 400,
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