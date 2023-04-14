import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Menu, MenuItem, Icon, Layout, Button, SettingsIcon } from '@ui-kitten/components';
import GlobalStyles from '../constants/styles';

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

const DWMIcon = (props) => (
    <Icon {...props} name='unlock-outline' />
);

const SettingIcon = (props) => (
    <Icon {...props} name='settings-2-outline' />
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
                    <Button style={[{ marginVertical: 4 }, GlobalStyles.button]} onPress={this.props.toggleTheme} accessoryLeft={LightIcon}></Button>
                    </>
                ) : (
                    <>
                    <LargeLogo />
                    <ExpandedAdminMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button style={[{ marginVertical: 4 }, GlobalStyles.button]} onPress={this.props.toggleTheme} accessoryLeft={LightIcon}>TOGGLE THEME</Button>
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
                    <Button style={{ marginVertical: 4 }} onPress={this.props.toggleTheme} accessoryLeft={LightIcon}></Button>
                    </>
                ) : (
                    <>
                    <LargeLogo />
                    <ExpandedUserMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button style={{ marginVertical: 4 }} onPress={this.props.toggleTheme} accessoryLeft={LightIcon}>TOGGLE THEME</Button>
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
        selectedInex={this.props.selectedIndex}
        onSelect={index => this.props.setSelectedIndex(index)}
        style={[GlobalStyles.bgGray]}>
            <MenuItem
                accessoryLeft={HomeIcon}
                style={this.props.selectedIndex.row === 0 ? styles.colSelectedMenuItem : styles.colMenuItem}
            />
            <MenuItem
                accessoryLeft={AlertsIcon}
                style={this.props.selectedIndex.row === 1 ? styles.colSelectedMenuItem : styles.colMenuItem}
            />
            <MenuItem
                accessoryLeft={TicketsIcon}
                style={this.props.selectedIndex.row === 2 ? styles.colSelectedMenuItem : styles.colMenuItem}
            />
            <MenuItem
                accessoryLeft={CoursesIcon}
                style={this.props.selectedIndex.row === 3 ? styles.colSelectedMenuItem : styles.colMenuItem}
            />
            <MenuItem
                accessoryLeft={DWMIcon}
                style={this.props.selectedIndex.row === 4 ? styles.colSelectedMenuItem : styles.colMenuItem}
            />
            <MenuItem
                accessoryLeft={SettingIcon}
                style={this.props.selectedIndex.row === 5 ? styles.colSelectedMenuItem : styles.colMenuItem}
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
        selectedInex={this.props.selectedIndex}
        onSelect={index => this.props.setSelectedIndex(index)}
        style={[GlobalStyles.bgGray]}>
            <MenuItem accessoryLeft={HomeIcon}/>
            <MenuItem accessoryLeft={AlertsIcon}/>
            <MenuItem accessoryLeft={CoursesIcon}/>
        </Menu>
        )
    }
}

// expanded admin menu
class ExpandedAdminMenu extends Component {
    render() {
        return (
            <Menu
            selectedInex={this.props.selectedIndex}
            onSelect={index => this.props.setSelectedIndex(index)}
            style={[GlobalStyles.bgGray]}>
                <MenuItem
                    title='Home'
                    style={this.props.selectedIndex.row === 0 ? styles.selectedMenuItem : styles.menuItem}
                    accessoryLeft={HomeIcon}
                />
                <MenuItem
                    title='Alarms'
                    style={this.props.selectedIndex.row === 1 ? styles.selectedMenuItem : styles.menuItem}
                    accessoryLeft={AlertsIcon}
                />
                <MenuItem
                    title='Events'
                    accessoryLeft={TicketsIcon}
                    style={this.props.selectedIndex.row === 2 ? styles.selectedMenuItem : styles.menuItem}
                />
                <MenuItem
                    title='Courses'
                    accessoryLeft={CoursesIcon}
                    style={this.props.selectedIndex.row === 3 ? styles.selectedMenuItem : styles.menuItem}
                />
                <MenuItem
                    title='Dark Web Monitoring'
                    accessoryLeft={DWMIcon}
                    style={this.props.selectedIndex.row === 4 ? styles.selectedMenuItem : styles.menuItem}
                />
                <MenuItem
                    title='Settings'
                    accessoryLeft={SettingIcon}
                    style={this.props.selectedIndex.row === 5 ? styles.selectedMenuItem : styles.menuItem}
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
            selectedInex={this.props.selectedIndex}
            onSelect={index => this.props.setSelectedIndex(index)}
            style={[GlobalStyles.bgGray]}>
                <MenuItem title='Home' accessoryLeft={HomeIcon}/>
                <MenuItem title='Alerts' accessoryLeft={AlertsIcon}/>
                <MenuItem title='Courses' accessoryLeft={CoursesIcon}/>
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
        margin: 5,
        borderRadius: 15,
        backgroundColor: '#CED1D5'
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