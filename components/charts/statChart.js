import { Layout, Text, Spinner, Card } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import GlobalStyles from '../../constants/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCircleExclamation, faStar } from '@fortawesome/free-solid-svg-icons';


const screenWidth = Dimensions.get("window").width;

const eventIcon = (props) => (
    <FontAwesomeIcon {...props} size="lg" icon={faEye} />
);

const alarmIcon = (props) => (
    <FontAwesomeIcon {...props} size="lg" icon={faCircleExclamation} />
);

const partnerIcon = (props) => (
    <FontAwesomeIcon {...props} size="lg" icon={faStar} />
);

export default class CustomStatChart extends React.Component {

    



    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        const alarmsHeader = (props) => (
            <Text style={styles.header}>ALARMS</Text>
        );

        const eventsHeader = (props) => (
            <Text style={styles.header}>EVENTS</Text>
        );

        const dwmHeader = (props) => (
            <Text style={styles.header}>FEATURED PARTNER</Text>
        );
        

        return (
            <Layout style={styles.container}>
                <Card
                    header={alarmsHeader}
                    style={[styles.item, GlobalStyles.card, { backgroundColor: '#cc7631' }]}>
                    <View style={styles.insideContainer}>
                        <View style={styles.icon}>
                            <FontAwesomeIcon style={{height: 32, color: '#cc7631'}} size="lg" icon={faCircleExclamation} />
                        </View>
                        <Text category='h6' status={this.props.alarms > 0 ? 'danger' : 'basic'} style={styles.count}>
                            {this.props.alarms ? this.props.alarms : <Spinner size='giant' status='info' />}
                        </Text>
                    </View>
                </Card>
                <Card
                    header={eventsHeader}
                    style={[styles.item, GlobalStyles.card, { backgroundColor: '#0b4d80' }]}>
                    <View style={styles.insideContainer}>
                        <View style={styles.icon}>
                            <FontAwesomeIcon style={{height: 32, color: '#0b4d80'}} size="lg" icon={faEye} />
                        </View>
                        <Text category='h6' style={styles.count}>
                            {this.props.events ? (this.props.events === 10000 ? '10k+' : this.props.events) : <Spinner size='giant' status='info' />}
                        </Text>
                    </View>
                </Card>
                <Card
                    header={dwmHeader}
                    style={[styles.item, GlobalStyles.card, { backgroundColor: '#010d27' }]}>
                        <View style={styles.insideContainer}>
                            <View style={styles.icon}>
                                <FontAwesomeIcon style={{height: 32, color: '#010d27'}} size="lg" icon={faStar} />
                            </View>
                            <View>
                                <Text category='h6' style={styles.count}>
                                    Office Tools
                                </Text>
                                <Text style={styles.title}>Manage your tasks</Text>
                            </View>
                        </View>
                </Card>
            </Layout>
         );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: '1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 150,
        maxHeight: 150,
        marginBottom: 10,
        rowGap: 10,
        columnGap: 10,
    },
    item: {
        height: 150,
        width: 350,
        maxWidth: '33%',
        borderColor: 'grey',
        borderWidth: 1,
    },
    insideContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    count: {
        fontSize: 45,
        color: 'white',
        flex: 1
    },
    title: {
        color: 'white',
    },
    header: {
        color: 'white',
        padding: 10,
    },
    icon: {
        backgroundColor: 'white',
        height: 52,
        width: 52,
        borderRadius: 10,
        justifyContent: 'center',
        marginRight: 5,
    },
    innerIcon: {
        color: 'black',
        height: 32,
    }
});