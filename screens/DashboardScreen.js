import React from 'react';
import { Text, Layout, Card, Input, Button, Divider, Icon, List, ListItem, Avatar, Menu, MenuItem, IndexPath, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { useNavigation, DrawerActions } from "@react-navigation/native";
import CustomPieChart from '../components/pieChart';
import CustomLineChart from '../components/lineChart';
import CustomBarChart from '../components/barChart';
import { DashboardAlertsList } from '../components/alertsList';
import { DashboardTicketsList } from '../components/ticketsList';
import { RequiredCourses, AllCourses } from '../components/coursesDashboard';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenContext, UsmContext } from '../App';
// usm api functions
import { getAlerts, getEvents } from '../services/usmApi';
// azure api functions
import { getMe } from '../services/azureApi';


const MenuIcon = (props) => (
    <Icon {...props} name='menu' />
);

const LogOutIcon = (props) => (
    <Icon {...props} name='log-out-outline' />
);

const HomeIcon = (props) => (
    <Icon {...props} name='home-outline' />
);

const AlertsIcon = (props) => (
    <Icon {...props} name='alert-triangle-outline' />
);

const TicketsIcon = (props) => (
    <Icon {...props} name='question-mark-circle-outline' />
);

const CoursesIcon = (props) => (
    <Icon {...props} name='book-open-outline' />
);

const DashboardScreen = () => {
    const { token, setToken } = React.useContext(TokenContext);
    const { usmToken, setUsmToken } = React.useContext(UsmContext);

    // logout user
    const logOut = async () => {
        // check if on mobile or web
        if (Platform.OS !== 'web') {
            // clear token from secure storage
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('expireTime');
            await SecureStore.deleteItemAsync('usm-token');
            await SecureStore.deleteItemAsync('usmExpireTime');
            // clear token from context
            setToken(null);
            setUsmToken(null);
        } else {
            // clear token from local storage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('expireTime');
            await AsyncStorage.removeItem('usm-token');
            await AsyncStorage.removeItem('usmExpireTime');
            // clear token from context
            setToken(null);
            setUsmToken(null);
        }
    };
    


    // dashboard navigation
    // menu collapsed or expanded
    const [menuWidth, setMenuWidth] = React.useState(50);
    const toggleDrawer = () => {
        if (menuWidth === 50) {
            setMenuWidth(200);
        } else {
            setMenuWidth(50);
        }
    };
    const renderDrawerAction = () => (
        <TopNavigationAction
            icon={MenuIcon}
            onPress={() => toggleDrawer()}
        />
    );

    const singOutAction = () => (
        <TopNavigationAction
            icon={LogOutIcon}
            onPress={() => logOut()}
        />
    );

    // get user info from api
    const [userInfo, setUserInfo] = React.useState({});
    const getUserInfo = async () => {
        // Get user's information from Microsoft Graph API
        const userInfo = await getMe(token);
        
        // Parse response and get user's name
        console.log(userInfo);
        setUserInfo(userInfo);
    };

    React.useEffect(() => {
        getUserInfo();
        getAlerts(usmToken);
        getEvents(usmToken);
    }, []);

    

    const menuData = [        { title: 'Home', icon: 'home' },        { title: 'Threat Detection', icon: 'alert-triangle-outline' },        { title: 'Vulnerability Scanning', icon: 'shield-outline' },        { title: 'Behavioral Monitoring', icon: 'activity-outline' },        { title: 'Log Management', icon: 'file-text-outline' },    ];


    const renderItem = ({ item, index }) => (
        <ListItem
            title={item.title}
            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: '#1e1e1e' }}
            accessoryLeft={() => <Icon name={item.icon} fill='#1e1e1e' />}
            style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff' }}
        />
    );
    // index for menu
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
            <TopNavigation
                title='CYPROTECK Dashboard'
                subtitle={'Welcome, ' + userInfo.givenName + '!'}
                alignment='center'
                accessoryLeft={renderDrawerAction}
                accessoryRight={singOutAction}
            />
            <Layout style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <Layout style={{ width: menuWidth, textAlign: 'center' }}>
                    {menuWidth === 50 ? (
                        <Menu
                    selectedInex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                        <MenuItem accessoryLeft={HomeIcon}/>
                        <MenuItem accessoryLeft={AlertsIcon}/>
                        <MenuItem accessoryLeft={TicketsIcon}/>
                        <MenuItem accessoryLeft={CoursesIcon}/>
                    </Menu>
                    ) : (
                        <Menu
                    selectedInex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                        <MenuItem title='Home' accessoryLeft={HomeIcon}/>
                        <MenuItem title='Alerts' accessoryLeft={AlertsIcon}/>
                        <MenuItem title='Tickets' accessoryLeft={TicketsIcon}/>
                        <MenuItem title='Courses' accessoryLeft={CoursesIcon}/>
                    </Menu>
                    )}
                </Layout>
                <ScrollView>
                {selectedIndex.row === 0 && (
                    <Layout style={{ flex: 1, padding: 20 }}>
                        <Text category='h3'>Home</Text>
                        <Layout style={{ display: 'flex', flex: '2', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Card style={styles.dashboardCard}>
                                <Text category='h6'>Threat Detection</Text>
                                <Text>Total Threats: 12</Text>
                                <CustomPieChart />
                                <Button>View Details</Button>
                            </Card>
                            <Card style={styles.dashboardCard}>
                                <Text category='h6'>Vulnerability Scanning</Text>
                                <Text>Total Vulnerabilities: 7</Text>
                                <CustomLineChart />
                                <Button>View Details</Button>
                            </Card>
                            <Card style={styles.dashboardCard}>
                                <Text category='h6'>Behavioral Monitoring</Text>
                                <Text>Total Alerts: 5</Text>
                                <CustomPieChart />
                                <Button>View Details</Button>
                            </Card>
                            <Card style={styles.dashboardCard}>
                            <Text category='h6'>Log Management</Text>
                            <Text>Total Logs: 100</Text>
                            <CustomBarChart />
                            <Button>View Details</Button>
                        </Card>
                    </Layout>
                </Layout>
                )}
                {selectedIndex.row === 1 && (
                    <Layout style={{ flex: 1, padding: 20 }}>
                        <Text category='h3'>Alerts</Text>
                        <DashboardAlertsList />
                    </Layout>
                )}
                {selectedIndex.row === 2 && (
                    <Layout style={{ flex: 1, padding: 20 }}>
                        <Text category='h3'>Tickets</Text>
                        <DashboardTicketsList />
                    </Layout>
                )}
                {selectedIndex.row === 3 && (
                    <Layout style={{ flex: 1, padding: 20 }}>
                        <Text category='h3'>Courses</Text>
                        <Text category='h6'>Required</Text>
                        <RequiredCourses />
                    </Layout>
                )}
                </ScrollView>
         </Layout>
            </View>
     </SafeAreaView>
 );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    dashboardCard: {
        maxWidth: '45%',
        width: 500,
        minWidth: 300,
        height: 400,
    }
  });