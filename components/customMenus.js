import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Menu, MenuItem, Icon, Layout } from '@ui-kitten/components';

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

// admin sidebar menu
export class AdminMenu extends Component {
    render() {
        return (
            <Layout style={{ width: this.props.menuWidth, textAlign: 'center' }}>
                {this.props.menuWidth === 50 ? (
                    <CollapsedAdminMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                ) : (
                    <ExpandedAdminMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
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
                <MenuItem title='Alerts' accessoryLeft={AlertsIcon}/>
                <MenuItem title='Tickets' accessoryLeft={TicketsIcon}/>
                <MenuItem title='Courses' accessoryLeft={CoursesIcon}/>
            </Menu>
        )
    }
}

// user sidebar menu
export class UserMenu extends Component {
    render() {
        return (
            <Layout style={{ width: this.props.menuWidth, textAlign: 'center' }}>
                {this.props.menuWidth === 50 ? (
                    <CollapsedUserMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                ) : (
                    <ExpandedUserMenu
                        selectedIndex={this.props.selectedIndex}
                        setSelectedIndex={this.props.setSelectedIndex}
                    />
                )}
            </Layout>
        );
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