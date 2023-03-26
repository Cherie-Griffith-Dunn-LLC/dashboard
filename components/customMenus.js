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
            <Layout style={{ width: this.props.menuWidth, textAlign: 'center' }}>
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
            <Layout style={{ width: this.props.menuWidth, textAlign: 'center' }}>
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
        onSelect={index => this.props.setSelectedIndex(index)}>
            <MenuItem accessoryLeft={HomeIcon}/>
            <MenuItem accessoryLeft={AlertsIcon}/>
            <MenuItem accessoryLeft={TicketsIcon}/>
            <MenuItem accessoryLeft={CoursesIcon}/>
            <MenuItem accessoryLeft={DWMIcon}/>
            <MenuItem accessoryLeft={SettingIcon}/>
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
        onSelect={index => this.props.setSelectedIndex(index)}>
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
            onSelect={index => this.props.setSelectedIndex(index)}>
                <MenuItem title='Home' accessoryLeft={HomeIcon}/>
                <MenuItem title='Alarms' accessoryLeft={AlertsIcon}/>
                <MenuItem title='Events' accessoryLeft={TicketsIcon}/>
                <MenuItem title='Courses' accessoryLeft={CoursesIcon}/>
                <MenuItem title='Dark Web Monitoring' accessoryLeft={DWMIcon}/>
                <MenuItem title='Settings' accessoryLeft={SettingIcon}/>
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
            onSelect={index => this.props.setSelectedIndex(index)}>
                <MenuItem title='Home' accessoryLeft={HomeIcon}/>
                <MenuItem title='Alerts' accessoryLeft={AlertsIcon}/>
                <MenuItem title='Courses' accessoryLeft={CoursesIcon}/>
            </Menu>
        )
    }
}


const styles = StyleSheet.create({
    smallLogo: {
        width: 16,
        height: 20,
        alignSelf: 'center',
    },
    largeLogo: {
        width: 132,
        height: 20,
        marginLeft: 16,
    }
});