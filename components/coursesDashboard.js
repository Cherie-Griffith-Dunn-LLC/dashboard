import React, { useState }  from 'react';
import { StyleSheet, Image, Modal } from 'react-native';
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
    //<iframe src="https://icy-tree-0500ba10f.2.azurestaticapps.net/Cyber_Security_html5_1035/content/index.html#/" width="100%" height="600px" frameborder="0"></iframe>

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleCardPress = (index) => {
        const course = requiredCourses[index];
        setModalContent(
            <iframe src={"https://icy-tree-0500ba10f.2.azurestaticapps.net/Cyber_Security_html5_1035/content/index.html#/"} style={{ width: '100%', height: '100%' }}></iframe>
        );
        setModalVisible(true);
      };

    const handleModalBackdropPress = () => {
        setModalVisible(false);
        setModalContent(null);
      };

    // return a card for each course in RequiredCourses
    return (
        <>
        <Layout style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
            {requiredCourses.map((course, index) => (
                <Card
                key={index}
                header={props => <Image {...props} source={require('../assets/courses/course-thumbnail.jpg')} style={styles.courseThumbnail} />}
                style={styles.courseCard}
                status='danger'
                onPress={() => handleCardPress(index)}
                >
                    <Text category='h6'>{course.title } {index + 1}</Text>
                    <Text>{course.description}</Text>
                </Card>
            ))}
        </Layout>
        <Modal visible={modalVisible} backdropStyle={styles.backdrop} onBackdropPress={handleModalBackdropPress}>
        {modalContent && (
          <>
            <Button style={styles.modalCloseButton} onPress={handleModalBackdropPress} >Close</Button>
            {modalContent}
          </>
        )}
      </Modal>
    </>
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
    courseThumbnail: {
        height: 120,
      },
      courseCard: {
        margin: 8,
        width: '45%',
      },
      backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalCloseButton: {
        position: 'absolute',
        top: 8,
        right: 23,
      },

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