import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Layout, Text } from '@ui-kitten/components';

const requiredCourses = new Array(1).fill({
  title: 'Cyber Security',
  description: 'Course Description',
});

const allCourses = new Array(8).fill({
    title: 'Course',
    description: 'Course Description',
  });

  const renderItemAccessory = (props) => (
    <Button {...props} size='tiny'>VIEW</Button>
);

const renderItemIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

export const RequiredCourses = () => {
    // return a card for each course in RequiredCourses
    return (
        <Layout style={{ flex: 'auto', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
            {requiredCourses.map((course, index) => (
                <Card
                key={index}
                header={props => <Text {...props}>{course.title}</Text>}
                style={{ margin: 5 }}
                status='primary'
                >
                <Text>{course.description}</Text>
            </Card>
            ))}
        </Layout>
    );
};

export const AllCourses = () => {
    // return a card for each course in RequiredCourses
    return (
        <Layout style={{ flex: 'auto', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
            {allCourses.map((course, index) => (
                <Card
                    key={index}
                    header={props => <Text {...props}>{course.title } {index + 1}</Text>}
                    style={{ margin: 5 }}
                    status='info'
                >
                    <Text>{course.description}</Text>
                </Card>
            ))}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});