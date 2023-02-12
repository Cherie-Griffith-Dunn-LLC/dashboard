import React from 'react';
import { Text, Layout, Card, Input, Button, Divider, Icon, List, ListItem, Avatar, Menu, MenuItem, IndexPath, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from "@react-navigation/native";

const dashboardHeader = (props) => (
    <Text {...props} style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        CYPROTECK Dashboard
    </Text>
);

const MenuIcon = (props) => (
    <Icon {...props} name='menu' />
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TopNavigation
                title={dashboardHeader}
                alignment='center'
                accessoryLeft={renderDrawerAction}
            />
            <Layout style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <Layout style={{ width: menuWidth, textAlign: 'center' }}>
                    {// only show menu if expanded
                    menuWidth !== 50 &&
                        <Text category='h4' style={{ marginBottom: 20 }}>
                            Menu
                        </Text>
                    }
                    {menuWidth === 50 ? (
                        <Menu
                    selectedInex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                        <MenuItem title='H' accessoryLeft={HomeIcon}/>
                        <MenuItem title='A' accessoryLeft={AlertsIcon}/>
                        <MenuItem title='T' accessoryLeft={TicketsIcon}/>
                        <MenuItem title='C' accessoryLeft={CoursesIcon}/>
                    </Menu>
                    ) : (
                        <Menu
                    selectedInex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                        <MenuItem title='Home'/>
                        <MenuItem title='Alerts'/>
                        <MenuItem title='Tickets'/>
                        <MenuItem title='Courses'/>
                    </Menu>
                    )}
                </Layout>
                <Layout style={{ flex: 1, padding: 20 }}>
                        <Text category='h3'>Home</Text>
                        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Card style={{ width: '48%', marginRight: '2%' }}>
                                <Text category='h6'>Threat Detection</Text>
                                <Text>Total Threats: 12</Text>
                                <Button>View Details</Button>
                            </Card>
                            <Card style={{ width: '48%', marginLeft: '2%' }}>
                                <Text category='h6'>Vulnerability Scanning</Text>
                                <Text>Total Vulnerabilities: 7</Text>
                                <Button>View Details</Button>
                            </Card>
                        </Layout>
                        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <Card style={{ width: '48%', marginRight: '2%' }}>
                                <Text category='h6'>Behavioral Monitoring</Text>
                                <Text>Total Alerts: 5</Text>
                                <Button>View Details</Button>
                            </Card>
                            <Card style={{ width: '48%', marginLeft: '2%', marginTop: '2%' }}>
                             <Text category='h6'>Log Management</Text>
                             <Text>Total Logs: 100</Text>
                             <Button>View Details</Button>
                         </Card>
                     </Layout>
             </Layout>
         </Layout>
     </SafeAreaView>
 );
};

export default DashboardScreen;