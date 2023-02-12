import React from 'react';
import { Text, Layout, Card, Input, Button, Divider, Icon, List, ListItem, Avatar, Menu, MenuItem, IndexPath } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const dashboardHeader = (props) => (
    <Text {...props} style={{ fontSize: 20, fontWeight: 'bold', color: '#1e1e1e', textAlign: 'center' }}>
        CYPROTECK Dashboard
    </Text>
);

const DashboardScreen = () => {
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
            <Layout style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <Layout style={{ width: 200 }}>
                    <Text category='h4' style={{ textAlign: 'center', marginBottom: 20 }}>
                        Menu
                    </Text>
                    <Menu
                    selectedInex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                        <MenuItem title='Home'/>
                        <MenuItem title='Alerts'/>
                        <MenuItem title='Tickets'/>
                        <MenuItem title='Courses'/>
                    </Menu>
                </Layout>
                <Layout style={{ flex: 1, padding: 20 }}>
                    <Card header={dashboardHeader}>
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
                 </Card>
             </Layout>
         </Layout>
     </SafeAreaView>
 );
};

export default DashboardScreen;