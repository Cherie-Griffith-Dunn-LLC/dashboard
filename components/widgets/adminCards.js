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
                dwm={this.props.dwm.page?.totalElements}
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
                    <Text appearance='hint'>Compromised data incidences</Text>
                    <LoadingStatus />
                </Card>
            );
        } else {
            return (
                <Card style={[styles.bottomCard, GlobalStyles.card]}>
                    <Text category='h6'>Dark Web Monitoring</Text>
                    <Text appearance='hint'>Compromised data incidences</Text>
                    <Layout style={{ display: 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                        <Layout style={{ alignItems: 'center', padding: 10, paddingTop: 0 }}>
                            <Text category='h6' style={styles.totalNumbers}>{this.props.data._embedded?.eventResources.length}</Text>
                            <Text category='label' appearance='hint'>Recent</Text>
                        </Layout>
                        <Layout style={{ alignItems: 'center', padding: 10, paddingTop: 0 }}>
                            <Text category='h6' style={styles.totalNumbers}>{this.props.data.page?.totalElements}</Text>
                            <Text category='label' appearance='hint'>Total</Text>
                        </Layout>
                    </Layout>
                </Card>
            );
        }
    }
}

export class LogManagementCard extends Component {
    render() {
        // check if data is empty
        if (this.props.data.length === 0) {
            return (
                <Card style={[styles.bottomCard, GlobalStyles.card]}>
                    <Text category='h6'>Courses Overview</Text>
                    <Layout style={{ display: 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                        <LoadingStatus />
                    </Layout>
                </Card>
            );
        } else {
            return (
                <Card style={[styles.bottomCard, GlobalStyles.card]}>
                    <Text category='h6'>Courses Overview</Text>
                    <Layout style={{ display: 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                        <Layout style={{ alignItems: 'center', padding: 10 }}>
                            <Text style={styles.totalNumbers} category='h6'>{this.props.data.totalAssignedCourses}</Text>
                            <Text category='label' appearance='hint'>Assigned</Text>
                        </Layout>
                        <Layout style={{ alignItems: 'center', padding: 10 }}>
                            <Text style={styles.totalNumbers} category='h6'>{this.props.data.totalInProgressCourses}</Text>
                            <Text category='label' appearance='hint'>In Progress</Text>
                        </Layout>
                        <Layout style={{ alignItems: 'center', padding: 10 }}>
                            <Text style={styles.totalNumbers} category='h6'>{this.props.data.totalCompletedCourses}</Text>
                            <Text category='label' appearance='hint'>Completed</Text>
                        </Layout>
                    </Layout>
                </Card>
            );
        }
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
                    <TrainingList setSelectedIndex={this.props.setSelectedIndex} data={this.props.data} />
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
        height: 300,
        borderColor: '#CED1D5',
        borderWidth: 1,
    },
    bottomCard: {
        maxWidth: '100%',
        width: 500,
        minWidth: '48%',
        height: 125,
        minHeight: 125,
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