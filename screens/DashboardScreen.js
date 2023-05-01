import React from 'react';
import { Text, Layout, Icon, IndexPath, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView, Platform, Image } from 'react-native';
import { DashboardAlarmsList } from '../components/alarmsList';
import { DashboardAlertsList } from '../components/investigationsList';
import { DashboardEventsList } from '../components/eventsList';
import { DWMList } from '../components/dwmList';
import { RequiredCourses, AllCourses, AllAssignments } from '../components/coursesDashboard';
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
import { getTrainingList, getCourseStatistics } from '../services/dbApi';
// menus
import { AdminMenu, UserMenu } from '../components/customMenus';
// data for charts
import { getAlarms, getEvents, getDWM, getInvestigations, getAllDWM } from '../services/usmApi';
import { UsersList } from '../components/settingUI';
import { BellIcon, SettingsIcon, LogoutIcon } from '../components/icons';

import GlobalStyles from '../constants/styles';

const MenuIcon = (props) => (
    <Icon {...props} name='menu' />
);

const SignOutIcon = (props) => (
    <View style={styles.iconContainer}>
        <Icon {...props} style={styles.icon} name='log-out-outline' />
    </View>
);

const NotificationIcon = (props) => (
    <View style={styles.iconContainer}>
        <Icon {...props} style={styles.icon} name='bell-outline' />
    </View>
);

const CogIcon = (props) => (
    <View style={styles.iconContainer}>
        <Icon {...props} style={styles.icon} name='settings-2-outline' />
    </View>
);

const logo = (props) => (
    <Image style={styles.logo} {...props}  source={require('../assets/cyplogo-blk.png')} />
);

const DashboardScreen = () => {
    const { token, setToken } = React.useContext(TokenContext);
    
    // Clock
    const [time, setTime] = React.useState(new Date().toString());
    // theme context
    const themeContext = React.useContext(ThemeContext);
    // loading state
    const [isLoading, setIsLoading] = React.useState(true);
    // data for charts
    const [alarms, setAlarms] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [alerts, setAlerts] = React.useState([]);
    const [dwm, setDwm] = React.useState([]);
    const [courses, setCourses] = React.useState([]);
    const [trainingList, setTrainingList] = React.useState([]);

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

    // update the clock every second
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    


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
            icon={NotificationIcon}
            onPress={() => setSelectedIndex(new IndexPath(1))}
        />
        <TopNavigationAction
            icon={CogIcon}
            onPress={() => setSelectedIndex(new IndexPath(5))}
        />
        <TopNavigationAction
            icon={SignOutIcon}
            onPress={() => logOut()}
        />
        </>
    );

    // get user info from api
    const [userInfo, setUserInfo] = React.useState({});
    const [userRoles, setUserRoles] = React.useState({});
    const getUserInfo = async () => {
        // Get user's information from Microsoft Graph API
        const userInfo = await getMe(token);
        const userRoles = await getRole(token);

        // Parse response and get user's name
        setUserInfo(userInfo);
        setUserRoles(userRoles);
    };

    // get data for charts
    const getChartData = async () => {
        // if user is admin
        if (userRoles.role === 'admin') {
            getAlarms(token, 20).then((response) => {
                setAlarms(response);
            });
            getAllDWM(token, 20).then((response) => {
                setDwm(response);
            });
            getEvents(token, 20).then((response) => {
                setEvents(response);
            });
            getTrainingList(token, 20).then((response) => {
                setTrainingList(response);
            });
            getCourseStatistics(token).then((response) => {
                setCourses(response);
            });
        } else {
            getInvestigations(token, 20).then((response) => {
                setAlerts(response);
            });
        }

    }

    React.useEffect(() => {
        getUserInfo().then(() => {
            setIsLoading(false);
        });
    }, []);
    // seperate chart data query so user role is a dependency of the function
    React.useEffect(() => {
        getChartData();
    }, [userRoles]);

    

    
    // index for menu
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

    // if loading show loading screen 
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={styles.largeLogo} source={require('../assets/cyplogo-blk.png')} />
                    <Spinner />
                </Layout>
            </SafeAreaView>
        )
    }
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
            <TopNavigation
                title={'Welcome, ' + (userInfo.givenName || "User")}
                subtitle={ time }
                alignment='center'
                accessoryLeft={renderDrawerAction}
                accessoryRight={singOutAction}
            />
            <Layout style={[GlobalStyles.bgGray, { flex: 1, display: 'flex', flexDirection: 'row', height: '100%' }]}>
                {userRoles.role === 'admin' ? (
                    <AdminMenu menuWidth={menuWidth} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} toggleTheme={themeContext.toggleTheme} />
                ) : (
                    <UserMenu menuWidth={menuWidth} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} toggleTheme={themeContext.toggleTheme} />
                )}
                <ScrollView>
                {selectedIndex.row === 0 && (
                    <Layout style={{ flex: 1, padding: 20, maxWidth: 1320, alignSelf: 'center', width: '100%' }}>
                        {userRoles.role === 'admin' && (
                            <StatsCard alarms={alarms} events={events} dwm={dwm} />
                        )}
                        <Layout style={{ display: 'flex', flex: '1', flexWrap: 'wrap', flexDirection: 'row', rowGap: 10, columnGap: 10, minHeight: '80vh', alignContent: 'space-evenly', justifyContent: 'space-between' }}>
                            {userRoles.role === 'admin' ? (
                                <>
                                <AlarmsCard data={alarms} setSelectedIndex={setSelectedIndex} />
                                <EventsCard data={events} setSelectedIndex={setSelectedIndex} />
                                <LogManagementCard data={courses} setSelectedIndex={setSelectedIndex} />
                                <BehavioralMonitoringCard data={dwm} setSelectedIndex={setSelectedIndex} />
                                <EmployeeTrainingCard data={trainingList} setSelectedIndex={setSelectedIndex} />
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
                        <Layout style={styles.container}>
                            <Text category='h3'>Alarms</Text>
                            <DashboardAlarmsList data={alarms} token={token} />
                        </Layout>
                    )
                ) : (
                    selectedIndex.row === 1 && (
                        <Layout style={styles.container}>
                            <Text category='h3'>Alerts</Text>
                            <DashboardAlertsList data={alerts} token={token} />
                        </Layout>
                    )
                )}
                {userRoles.role === 'admin' && (
                    selectedIndex.row === 2 && (
                    <Layout style={styles.container}>
                        <Text category='h3'>Events</Text>
                        <DashboardEventsList data={events} token={token} />
                    </Layout>
                    )
                )}
                {userRoles.role === 'admin' ? (
                    selectedIndex.row === 3 && (
                        <Layout style={styles.container}>
                            <Text category='h3'>Required</Text>
                            <RequiredCourses token={token} />
                            <Text category='h3'>Assignments</Text>
                            <AllAssignments token={token} />
                        </Layout>
                    )
                ) : (
                    selectedIndex.row === 2 && (
                            <Layout style={styles.container}>
                                <Text category='h3'>Courses</Text>
                                <Text category='h3'>Required</Text>
                                <RequiredCourses />
                            </Layout>
                        )
                )}
                {userRoles.role === 'admin' && (
                    selectedIndex.row === 4 && (
                        <Layout style={styles.container}>
                            <Text category='h3'>Dark Web Monitoring</Text>
                            <DWMList data={dwm} token={token} />
                        </Layout>
                    )
                )}
                {userRoles.role === 'admin' && (
                    selectedIndex.row === 5 && (
                        <Layout style={styles.container}>
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
    },
    container: {
        flex: 1,
        padding: 20,
        minHeight: '85vh',
    },
    largeLogo: {
        width: 265,
        height: 40,
        margin: 20,
        alignSelf: 'center'
    },
    iconContainer: {
        backgroundColor: 'white',
        borderColor: '#CED1D5',
        borderWidth: 1,
        height: 40,
        width: 40,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: 'black',
        height: 20,
        width: 20,
    }
});