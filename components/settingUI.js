import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
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
            .then((users) => {
                setDbUsers(users);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    };

    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {currentUser && (
                <Card style={styles.card} header={() => <Text category='h6'>{currentUser.displayName}</Text>}>
                    <Text>{currentUser.mail}</Text>
                    <Text>{currentUser.jobTitle}</Text>
                    <Text>{currentUser.department}</Text>
                    <Text>{currentUser.mobilePhone}</Text>
                    <Text>{currentUser.officeLocation}</Text>
                </Card>
            )}

            <Text category='h1'>Users</Text>
            <Button onPress={handleGetUsersPress}>Get Users</Button>
            <Button onPress={handleUpdateUsersPress}>Update Users</Button>
            <Button onPress={handleGetDbUsersPress}>Get DB Users</Button>
            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>{error.message}</Text>
            ) : users.length > 0 ? (
                <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {users.map((user) => (
                        <Card key={user.id} style={styles.card} header={() => <Text category='h6'>{user.displayName}</Text>}>
                            <Text>{user.mail}</Text>
                            <Text>{user.jobTitle}</Text>
                            <Text>{user.department}</Text>
                            <Text>{user.mobilePhone}</Text>
                            <Text>{user.officeLocation}</Text>
                        </Card>
                    ))}
                </Layout>
            ) : dbUsers.length > 0 && (
                <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {dbUsers.map((user) => (
                        <Card key={user.id} style={styles.card} header={() => <Text category='h6'>{user.name}</Text>}>
                        <Text>{user.email}</Text>
                        <Text>{user.job_title}</Text>
                    </Card>
                    ))}
                </Layout>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
});
