import React from 'react';
import { Text, Layout, Icon, IndexPath, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView, Platform, Image } from 'react-native';
import { DashboardAlarmsList } from '../components/alarmsList';
import { DashboardAlertsList } from '../components/investigationsList';
import { DashboardEventsList } from '../components/eventsList';
import { DWMList } from '../components/dwmList';
import { RequiredCourses, AllCourses } from '../components/coursesDashboard';
import { ThemeContext } from '../contexts/theme-context';
// admin cards
import { AlarmsCard, EventsCard, BehavioralMonitoringCard, LogManagementCard, StatsCard, EmployeeTrainingCard } from '../components/widgets/adminCards';
// user cards
import { UserAlertsCard, UserCoursesCard } from '../components/widgets/userCards';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenContext } from '../contexts/tokenContext';
// azure api functions
import { getMe, getRole, getUsers } from '../services/azureApi';
// menus
import { AdminMenu, UserMenu } from '../components/customMenus';
// data for charts
import { getAlarms, getEvents, getDWM, getInvestigations } from '../services/usmApi';
import { UsersList } from '../components/settingUI';

import GlobalStyles from '../constants/styles';

const MenuIcon = (props) => (
    <Icon {...props} name='menu' />
);

const LogOutIcon = (props) => (
    <Icon {...props} name='log-out-outline' />
);

const BellIcon = (props) => (
    <Icon {...props} name='bell-outline' />
);

const SettingsIcon = (props) => (
    <Icon {...props} name='settings-2-outline' />
);

const logo = (props) => (
    <Image style={styles.logo} {...props}  source={require('../assets/cyplogo-blk.png')} />
);

const DashboardScreen = () => {
    const { token, setToken } = React.useContext(TokenContext);

    // theme context
    const themeContext = React.useContext(ThemeContext);
    // data for charts
    const [alarms, setAlarms] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [alerts, setAlerts] = React.useState([]);
    const [dwm, setDwm] = React.useState([]);
    const [courses, setCourses] = React.useState([]);

    // logout user
    const logOut = async () => {
        // check if on mobile or web
        if (Platform.OS !== 'web') {
            // clear token from secure storage
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('expireTime');
            // clear token from context
            setToken(null);
        } else {
            // clear token from local storage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('expireTime');
            // clear token from context
            setToken(null);
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
        <>
        <TopNavigationAction
            icon={BellIcon}
            onPress={() => setSelectedIndex(new IndexPath(1))}
        />
        <TopNavigationAction
            icon={SettingsIcon}
            onPress={() => setSelectedIndex(new IndexPath(5))}
        />
        <TopNavigationAction
            icon={LogOutIcon}
            onPress={() => logOut()}
        />
        </>
    );

    // get user info from api
    const [userInfo, setUserInfo] = React.useState({});
    const [userRoles, setUserRoles] = React.useState({});
    const [allUsers, setAllUsers] = React.useState([]);
    const getUserInfo = async () => {
        // Get user's information from Microsoft Graph API
        const userInfo = await getMe(token);
        const userRoles = await getRole(token);
        const allUsers = await getUsers(token);

        // Parse response and get user's name
        setUserInfo(userInfo);
        setUserRoles(userRoles);
        //only call this if the user is an admin
        if (userRoles.role === 'admin') {
            setAllUsers(allUsers);
            console.log(allUsers);
        }    
    };

    // get data for charts
    const getChartData = async () => {
        getEvents(token, 20).then((response) => {
            setEvents(response);
          });
        getAlarms(token, 20).then((response) => {
            setAlarms(response);
          });

        getInvestigations(token, 20).then((response) => {
            setAlerts(response);
            });
    }

    React.useEffect(() => {
        getUserInfo();
        getChartData();
    }, []);

    

    
    // index for menu
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
            <TopNavigation
                title='CYPROTECK Dashboard'
                subtitle={'Welcome, ' + (userInfo.givenName || "User") + '!'}
                alignment='center'
                accessoryLeft={renderDrawerAction}
                accessoryRight={singOutAction}
            />
            <Layout style={[GlobalStyles.bgGray, { flex: 1, display: 'flex', flexDirection: 'row' }]}>
                {userRoles.role === 'admin' ? (
                    <AdminMenu menuWidth={menuWidth} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} toggleTheme={themeContext.toggleTheme} />
                ) : (
                    <UserMenu menuWidth={menuWidth} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} toggleTheme={themeContext.toggleTheme} />
                )}
                <ScrollView>
                {selectedIndex.row === 0 && (
                    <Layout style={{ flex: 1, padding: 20, maxWidth: 1320, alignSelf: 'center' }}>
                        <Text category='h3'>Home</Text>
                        {userRoles.role === 'admin' && (
                            <StatsCard alarms={alarms} events={events} />
                        )}
                        <Layout style={{ display: 'flex', flex: '1', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', rowGap: 10, columnGap: 10, alignItems: 'center', alignContent: 'space-evenly' }}>
                            {userRoles.role === 'admin' ? (
                                <>
                                <AlarmsCard data={alarms} setSelectedIndex={setSelectedIndex} />
                                <EventsCard data={events} setSelectedIndex={setSelectedIndex} />
                                <LogManagementCard setSelectedIndex={setSelectedIndex} />
                                <BehavioralMonitoringCard data={alarms} setSelectedIndex={setSelectedIndex} />
                                <EmployeeTrainingCard data={alarms} setSelectedIndex={setSelectedIndex} />
                                </>
                            ) : (
                                <>
                                <UserAlertsCard data={alerts} setSelectedIndex={setSelectedIndex} />
                                <UserCoursesCard setSelectedIndex={setSelectedIndex} />
                                </>
                            )}
                        </Layout>
                    </Layout>
                )}
                {userRoles.role === 'admin' ? (
                    selectedIndex.row === 1 && (
                        <Layout style={{ flex: 1, padding: 20 }}>
                            <Text category='h3'>Alarms</Text>
                            <DashboardAlarmsList token={token} />
                        </Layout>
                    )
                ) : (
                    selectedIndex.row === 1 && (
                        <Layout style={{ flex: 1, padding: 20 }}>
                            <Text category='h3'>Alerts</Text>
                            <DashboardAlertsList token={token} />
                        </Layout>
                    )
                )}
                {userRoles.role === 'admin' && (
                    selectedIndex.row === 2 && (
                    <Layout style={{ flex: 1, padding: 20 }}>
                        <Text category='h3'>Events</Text>
                        <DashboardEventsList token={token} />
                    </Layout>
                    )
                )}
                {userRoles.role === 'admin' ? (
                    selectedIndex.row === 3 && (
                        <Layout style={{ flex: 1, padding: 20 }}>
                            <Text category='h3'>Required</Text>
                            <RequiredCourses />
                            <Text category='h3'>All Courses</Text>
                            <AllCourses token={token} />
                        </Layout>
                    )
                ) : (
                    selectedIndex.row === 2 && (
                            <Layout style={{ flex: 1, padding: 20 }}>
                                <Text category='h3'>Courses</Text>
                                <Text category='h3'>Required</Text>
                                <RequiredCourses />
                            </Layout>
                        )
                )}
                {userRoles.role === 'admin' && (
                    selectedIndex.row === 4 && (
                        <Layout style={{ flex: 1, padding: 20 }}>
                            <Text category='h3'>Dark Web Monitoring</Text>
                            <DWMList />
                        </Layout>
                    )
                )}
                {userRoles.role === 'admin' && (
                    selectedIndex.row === 5 && (
                        <Layout style={{ flex: 1, padding: 20 }}>
                            <Text category='h3'>Settings</Text>
                            <UsersList token={token} />
                        </Layout>
                    )
                )}
                </ScrollView>
         </Layout>
            </View>
     </SafeAreaView>
 );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    logo: {
        height: '20px',
        width: '105px',
    }
});