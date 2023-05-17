import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Menu, MenuItem, Icon, Layout, Button, Text } from '@ui-kitten/components';
import GlobalStyles from '../constants/styles';
import * as WebBrowser from 'expo-web-browser';

const HomeIcon = (props) => (
    <Icon {...props} name='home-outline' />
);

const AlertsIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

const TicketsIcon = (props) => (
    <Icon {...props} name='activity' />
);

const CoursesIcon = (props) => (
    <Icon {...props} name='book-open-outline' />
);

const DWMIcon = (props) => (
    <Icon {...props} name='pie-chart-outline' />
);

const SettingIcon = (props) => (
    <Icon {...props} name='settings-2-outline' />
);

const SupportIcon = (props) => (
    <Icon {...props} name='people-outline' />
);

const LightIcon = (props) => (
    <Icon {...props} name='sun-outline' />
);

const DarkIcon = (props) => (
    <Icon {...props} name='moon-outline' />
);

const SmallLogo = (props) => (
    <Image style={styles.smallLogo} {...props}  source={require('../assets/cyplogo-shield_symbol-blk.svg')} />
);

const LargeLogo = (props) => (
    <Image style={styles.largeLogo} {...props}  source={require('../assets/cyplogo-blk.png')} />
);

// function to open link in app browser
const openLink = async (url) => {
    await WebBrowser.openBrowserAsync(url);
}

// admin sidebar menu
export class AdminMenu extends Component {
    render() {
        return (
            <Layout style={[GlobalStyles.bgGray, { width: this.props.menuWidth, textAlign: 'center' }]}>
                {this.props.menuWidth === 50 ? (
                    <>
                    <SmallLogo />
                    <CollapsedAdminMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button
                        onPress={() => openLink('https://cyproteck.com/?page_id=1087')}
                        accessoryLeft={SupportIcon}
                        appearance='ghost'
                        status='basic'
                        style={{ alignSelf: 'center', marginBottom: 20, marginTop: 20 }}></Button>
                    </>
                ) : (
                    <>
                    <LargeLogo />
                    <ExpandedAdminMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button
                        onPress={() => openLink('https://cyproteck.com/?page_id=1087')}
                        accessoryLeft={SupportIcon}
                        appearance='ghost'
                        status='basic'
                        style={{ alignSelf: 'center', marginBottom: 20, marginTop: 20 }}>Support Center</Button>
                    <Text category='label'>&copy; CYPROTECK, Inc.</Text>
                    <Text category='c2' appearance='hint'>Terms of Use | Privacy Policy</Text>
                    </>
                )}
            </Layout>
        );
    }
}

// user sidebar menu
export class UserMenu extends Component {
    render() {
        return (
            <Layout style={[GlobalStyles.bgGray, { width: this.props.menuWidth, textAlign: 'center' }]}>
                {this.props.menuWidth === 50 ? (
                    <>
                    <SmallLogo />
                    <CollapsedUserMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button
                        onPress={() => openLink('https://cyproteck.com/?page_id=1087')}
                        accessoryLeft={SupportIcon}
                        appearance='ghost'
                        status='basic'
                        style={{ alignSelf: 'center', marginBottom: 20, marginTop: 20 }}></Button>
                    </>
                ) : (
                    <>
                    <LargeLogo />
                    <ExpandedUserMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button
                        onPress={() => openLink('https://cyproteck.com/?page_id=1087')}
                        accessoryLeft={SupportIcon}
                        appearance='ghost'
                        status='basic'
                        style={{ alignSelf: 'center', marginBottom: 20, marginTop: 20 }}>Support Center</Button>
                    <Text>&copy; CYPROTECK, Inc.</Text>
                    <Text category='c2' appearance='hint'>Terms of Use | Privacy Policy</Text>
                    </>
                )}
            </Layout>
        );
    }
}

// collapsed admin menu
class CollapsedAdminMenu extends Component {
    render() {
        return (
            <Menu
        selectedIndex={this.props.selectedIndex}
        onSelect={index => this.props.setSelectedIndex(index)}
        style={[GlobalStyles.bgGray]}>
            <MenuItem
                accessoryLeft={HomeIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 0}
            />
            <MenuItem
                accessoryLeft={AlertsIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 1}
            />
            <MenuItem
                accessoryLeft={TicketsIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 2}
            />
            <MenuItem
                accessoryLeft={CoursesIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 3}
            />
            <MenuItem
                accessoryLeft={DWMIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 4}
            />
            <MenuItem
                accessoryLeft={SettingIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 5}
            />
        </Menu>
        )
    }
}

// collapsed user menu
class CollapsedUserMenu extends Component {
    render() {
        return (
            <Menu
        selectedIndex={this.props.selectedIndex}
        onSelect={index => this.props.setSelectedIndex(index)}
        style={[GlobalStyles.bgGray]}>
            <MenuItem
                accessoryLeft={HomeIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 0}
            />
            <MenuItem
                accessoryLeft={AlertsIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 1}
            />
            <MenuItem
                accessoryLeft={CoursesIcon}
                style={styles.menuItem}
                selected={this.props.selectedIndex.row === 2}
            />
        </Menu>
        )
    }
}

// expanded admin menu
class ExpandedAdminMenu extends Component {
    render() {
        return (
            <Menu
            selectedIndex={this.props.selectedIndex}
            onSelect={index => this.props.setSelectedIndex(index)}
            style={[GlobalStyles.bgGray]}>
                <MenuItem
                    title='Home'
                    selected={this.props.selectedIndex.row === 0}
                    style={styles.menuItem}
                    accessoryLeft={HomeIcon}
                />
                <MenuItem
                    title='Alarms'
                    selected={this.props.selectedIndex.row === 1}
                    style={styles.menuItem}
                    accessoryLeft={AlertsIcon}
                />
                <MenuItem
                    title='Events'
                    selected={this.props.selectedIndex.row === 2}
                    style={styles.menuItem}
                    accessoryLeft={TicketsIcon}
                />
                <MenuItem
                    title='Courses'
                    accessoryLeft={CoursesIcon}
                    style={styles.menuItem}
                    selected={this.props.selectedIndex.row === 3}
                />
                <MenuItem
                    title='Dark Web Monitoring'
                    accessoryLeft={DWMIcon}
                    style={styles.menuItem}
                    selected={this.props.selectedIndex.row === 4}
                />
                <MenuItem
                    title='Settings'
                    accessoryLeft={SettingIcon}
                    style={styles.menuItem}
                    selected={this.props.selectedIndex.row === 5}
                />
            </Menu>
        )
    }
}

// expanded user menu
class ExpandedUserMenu extends Component {
    render() {
        return (
            <Menu
            selectedIndex={this.props.selectedIndex}
            onSelect={index => this.props.setSelectedIndex(index)}
            style={[GlobalStyles.bgGray]}>
                <MenuItem
                    title='Home'
                    accessoryLeft={HomeIcon}
                    style={styles.menuItem}
                    selected={this.props.selectedIndex.row === 0}
                />
                <MenuItem
                    title='Alerts'
                    accessoryLeft={AlertsIcon}
                    style={styles.menuItem}
                    selected={this.props.selectedIndex.row === 1}
                />
                <MenuItem
                    selected={this.props.selectedIndex.row === 2}
                    title='Courses'
                    style={styles.menuItem}
                    accessoryLeft={CoursesIcon}
                />
            </Menu>
        )
    }
}


const styles = StyleSheet.create({
    smallLogo: {
        width: 18,
        height: 22,
        marginBottom: 20,
        marginTop: 10,
        alignSelf: 'center',
    },
    largeLogo: {
        width: 150,
        height: 22,
        margin: 20,
        alignSelf: 'center',
    },
    menuItem: {
        borderRadius: 15,
    },
    selectedMenuItem: {
        backgroundColor: 'black',
        color: '#FFFFFF',
        borderRadius: 15,
        margin: 5,
    },
    colMenuItem: {
        borderRadius: 15,
        backgroundColor: '#CED1D5'
    },
    colSelectedMenuItem: {
        backgroundColor: 'black',
        color: '#FFFFFF',
        borderRadius: 15,
    }
});