import React, { useEffect, useState }  from 'react';
import { StyleSheet, Image, Modal } from 'react-native';
import { Button, Card, Icon, Layout, Text } from '@ui-kitten/components';
import GlobalStyles from '../constants/styles';
import { getDbCourses, getCoursesByUser, assignCourse } from '../services/dbApi';

export const RequiredCourses = (props) => {
    const [courses, setCourses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
  
    useEffect(() => {
      getCoursesByUser(props.token).then((data) => {
        setCourses(data);
      });
    }, []);
  
    const handleCardPress = (url) => {
      setModalContent(
          <iframe src={url} style={{ width: '100%', height: '100%' }}></iframe>
      );
      setModalVisible(true);
    };
  
    const handleModalBackdropPress = () => {
      setModalVisible(false);
      setModalContent(null);
    };
    
      return (
          <>
          <Layout style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
              {courses.map((course, index) => (
                  <Card
                      key={index}
                      header={props => <Image {...props} source={require('../assets/courses/course-thumbnail.jpg')} style={styles.courseThumbnail} />}
                      style={styles.courseCard}
                      status='info'
                      onPress={() => handleCardPress(course.url)}
                  >
                      <Text category='h6'>{course.name}</Text>
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



export const AllCourses = (props) => {
    const [courses, setCourses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
  
    useEffect(() => {
      getDbCourses(props.token).then((data) => {
        setCourses(data);
      });
    }, []);
  
    const handleCardPress = (url) => {
      setModalContent(
        <iframe src={url} style={{ width: '100%', height: '100%' }}></iframe>
      );
      setModalVisible(true);
    };
  
    const handleModalBackdropPress = () => {
      setModalVisible(false);
      setModalContent(null);
    };
  
    const handleCourseAssignment = async (id) => {
      try {
        const response = await assignCourse(props.token, id);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <>
        <Layout style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }}>
          {courses.map((course, index) => (
            <Card
              key={index}
              header={(props) => (
                <Image {...props} source={require('../assets/courses/course-thumbnail.jpg')} style={styles.courseThumbnail} />
              )}
              style={styles.requiredCourseCard} // Changed from courseCard
              status='info'
              onPress={() => handleCardPress(course.url)}
              footer={
                <Button
                  style={styles.footerButton}
                  appearance='outline'
                  onPress={() => handleCourseAssignment(course.id)}
                >
                  Assign
                </Button>
              }
            >
              <Text category='h6'>{course.name}</Text>
              <Text>{course.description}</Text>
            </Card>
          ))}
        </Layout>
        <Modal visible={modalVisible} backdropStyle={styles.backdrop} onBackdropPress={handleModalBackdropPress}>
          {modalContent && (
            <>
              <Button style={styles.modalCloseButton} onPress={handleModalBackdropPress} >
                Close
              </Button>
              {modalContent}
            </>
          )}
        </Modal>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    courseThumbnail: {
      height: 120,
    },
    requiredCourseCard: { // Changed from courseCard
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
      borderRadius: '15px'
    },
    footerButton: {
      marginVertical: 8,
    },
    container: {
      flex: 1,
    },
    courseThumbnail: {
      width: 260,
      height: 150,
      marginLeft: 0,
    },
  });
  