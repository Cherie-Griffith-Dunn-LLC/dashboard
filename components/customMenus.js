import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Menu, MenuItem, Icon, Layout, Button } from '@ui-kitten/components';

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


const LightIcon = (props) => (
    <Icon {...props} name='sun-outline' />
);

const DarkIcon = (props) => (
    <Icon {...props} name='moon-outline' />
);

// admin sidebar menu
export class AdminMenu extends Component {
    render() {
        return (
            <Layout style={{ width: this.props.menuWidth, textAlign: 'center' }}>
                {this.props.menuWidth === 50 ? (
                    <>
                    <CollapsedAdminMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button style={{ marginVertical: 4 }} onPress={this.props.toggleTheme} accessoryLeft={LightIcon}></Button>
                    </>
                ) : (
                    <>
                    <ExpandedAdminMenu
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

// user sidebar menu
export class UserMenu extends Component {
    render() {
        return (
            <Layout style={{ width: this.props.menuWidth, textAlign: 'center' }}>
                {this.props.menuWidth === 50 ? (
                    <>
                    <CollapsedUserMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                    <Button style={{ marginVertical: 4 }} onPress={this.props.toggleTheme} accessoryLeft={LightIcon}></Button>
                    </>
                ) : (
                    <>
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
                <MenuItem title='Courses' accessoryLeft={CoursesIcon}/>
            </Menu>
        )
    }
}


const styles = StyleSheet.create({

});