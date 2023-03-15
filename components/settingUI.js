import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Modal } from 'react-native';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
import { getMe, getRole, getUsers } from '../services/azureApi';

export const UsersList = (props) => {
    //call the getme function
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUsers(props.token)
            .then((users) => {
                setUsers(users);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    return (
        console.log(props.token),
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text category='h1'>Users</Text>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text>{error.message}</Text>
                ) : (
                    users.map((user) => (
                        <Card key={user.id} style={styles.card} header={() => <Text category='h6'>{user.displayName}</Text>}>
                            <Text>{user.mail}</Text>
                            <Text>{user.jobTitle}</Text>
                            <Text>{user.department}</Text>
                            <Text>{user.mobilePhone}</Text>
                            <Text>{user.officeLocation}</Text>
                        </Card>
                    ))
                )}
            </Layout>
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