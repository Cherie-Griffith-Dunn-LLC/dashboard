import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Divider, Layout, Text, List, ListItem, Icon } from '@ui-kitten/components';
import { getMe, getUsers, postUsers } from '../services/azureApi';
import { getDbUsers } from '../services/dbApi';

export const UsersList = (props) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dbUsers, setDbUsers] = useState([]);

    useEffect(() => {
        getMe(props.token)
            .then((user) => {
                setCurrentUser(user);
            })
            .catch((error) => {
                setError(error);
            });
    }, []);

    const handleGetUsersPress = () => {
        setLoading(true);
        getUsers(props.token)
            .then((users) => {
                setUsers(users);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    };

    const handleUpdateUsersPress = () => {
        setLoading(true);
        postUsers(users, props.token)
            .then(() => {
                setLoading(false);
                alert('Users updated successfully.');
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                alert('Error updating users.');
            });
    };

    const handleGetDbUsersPress = () => {
        setLoading(true);
        getDbUsers(props.token)
            .then((dbUsers) => {
                setDbUsers(dbUsers);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    };

    const renderItemAccessory = (user) => (
        <Button size='tiny' onPress={() => alert(`User ID: ${user.id}`)}>Details</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name='person' />
    );

    const renderItem = ({ item }) => (
        <ListItem
            title={item.displayName || item.name}
            description={item.mail || item.email}
            accessoryLeft={renderItemIcon}
            accessoryRight={() => renderItemAccessory(item)}
        />
    );

    return (
        <Layout style={styles.container}>
            {currentUser && (
                <List
                    style={styles.currentUserList}
                    data={[
                        { title: 'Name', value: currentUser.displayName },
                        { title: 'Mail', value: currentUser.mail },
                        { title: 'Job Title', value: currentUser.jobTitle },
                        { title: 'Department', value: currentUser.department },
                        
                    ]}
                    renderItem={({ item }) => (
                        <ListItem title={item.title} description={item.value} />
                    )}
                    renderHeader={() => <Text category='h6' style={styles.currentUserHeader}>{currentUser.displayName}</Text>}
                />
            )}

            <Layout style={styles.footer}>
                <Text category='h4' style={styles.title}>Users</Text>
                <Layout style={styles.buttonGroup}>
                    <Button status='info' style={styles.button} onPress={handleGetUsersPress}>Get Users</Button>
                    <Button status='info' style={styles.button} onPress={handleUpdateUsersPress}>Update Users</Button>
                    <Button status='info' style={styles.button} onPress={handleGetDbUsersPress}>Edit Users</Button>
                </Layout>
            </Layout>
            <ScrollView>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text>{error.message}</Text>
                ) : users.length > 0 || dbUsers.length > 0 ? (
                    <List
                        style={styles.list}
                        data={[...users, ...dbUsers]}
                        renderItem={renderItem}
                    />
                ) : null}
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        backgroundColor: '#f0f0f0',
    },
    currentUserList: {
        marginBottom: 20,
    },
    currentUserHeader: {
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    list: {
        maxHeight: 285,
    },
    footer: {
        alignSelf: 'left',
        marginTop: 20,
    },
    title: {
        marginTop: 10,
        marginBottom: 15,
        alignSelf: 'left',
    },
    buttonGroup: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'left',
    },
    button: {
        borderRadius: '15px',
        width: '140px',
        height: '25px',
        marginHorizontal: 5,
    },
});