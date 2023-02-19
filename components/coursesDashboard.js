import React from 'react';
import { StyleSheet, Image } from 'react-native';
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
        <Layout style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
            {requiredCourses.map((course, index) => (
                <Card
                key={index}
                header={props => <Image {...props} source={require('../assets/courses/course-thumbnail.jpg')} style={styles.courseThumbnail} />}
                style={styles.courseCard}
                status='danger'
                >
                    <Text category='h6'>{course.title } {index + 1}</Text>
                    <Text>{course.description}</Text>
                </Card>
            ))}
        </Layout>
    );
};

export const AllCourses = () => {
    // return a card for each course in RequiredCourses
    return (
        <Layout style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
            {allCourses.map((course, index) => (
                <Card
                    key={index}
                    header={props => <Image {...props} source={require('../assets/courses/course-thumbnail.jpg')} style={styles.courseThumbnail} />}
                    style={styles.courseCard}
                    status='info'
                >
                    <Text category='h6'>{course.title } {index + 1}</Text>
                    <Text>{course.description}</Text>
                </Card>
            ))}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    courseCard: {
        width: 260,
        height: 260,
        margin: 5,
    },
    courseThumbnail: {
        width: 260,
        height: 150,
        marginLeft: 0,
    }
});