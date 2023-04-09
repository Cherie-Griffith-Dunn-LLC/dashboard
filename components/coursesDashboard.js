import React, { useEffect, useState }  from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider, useTheme, Spinner, Layout } from '@ui-kitten/components';
import { getDbCourses, getCoursesByUser, assignCourse, getAllAssignments } from '../services/dbApi';
import GlobalStyles from '../constants/styles';


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
                      style={styles.requiredCourseCard}
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


export const AllAssignments = (props) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [currentData, setCurrentData] = useState(null);
  
    useEffect(() => {
      getAllAssignments(props.token).then((data) => {
        setAssignments(data);
        setLoading(false);
      });
    }, []);
  
    const handleCardPress = (data) => {
      setCurrentData(data);
      setVisible(true);
    };
  
    const handleModalBackdropPress = () => {
      setVisible(false);
      setCurrentData(null);
    };
  
    const renderItemIcon = (props) => (
      <Icon {...props} name='book-outline' />
    );
  
    const renderItemAccessory = (props, data) => (
      <Button
        {...props}
        onPress={() => handleCardPress(data)}
        accessoryLeft={buttonArrow}
        size='medium'
        status='basic'>
      </Button>
    );
  
    const renderItem = ({ item }) => (
      <ListItem
        title={`${item.employee_name}`}
        description={`${item.course_name}`}
        accessoryLeft={renderItemIcon}
        accessoryRight={(props) => renderItemAccessory(props, item)}
      />
    );
  
    const buttonArrow = (props) => (
      <Icon {...props} name='arrow-ios-forward-outline' />
    );
  
    const cardHeader = (props) => (
      <View {...props} style={[props.style, styles.headerContainer]}>
        <Text category='h6'>{currentData?.employee_name}</Text>
        <Text category='s1'>{currentData?.course_name}</Text>
      </View>
    );
  
    const cardFooter = (props) => (
      <View {...props} style={[props.style, styles.cardFooter]}>
        <Button style={[GlobalStyles.button, styles.button]} onPress={handleModalBackdropPress}>Close</Button>
      </View>
    );
  
    if (loading) {
      return (
        <Text>
          <Spinner size='giant' status='info' />
          Loading...
        </Text>
      )
    }
  
    if (assignments.length === 0) {
      return (
        <Text>No assignments found.</Text>
      )
    }
  
    return (
      <>
        <List
          style={{height: '80vh'}}
          data={assignments}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={handleModalBackdropPress}>
          {currentData && (
            <Card header={cardHeader} footer={cardFooter} status='info'>
              <Text>Assign Date: {currentData.assign_date}</Text>
              <Text>Start Date: {currentData.start_date}</Text>
              <Text>Completion Date: {currentData.completion_date}</Text>
            </Card>
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
      width: '15%',
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
      flex: 10,
    },
    courseThumbnail: {
      width: 260,
      height: 150,
      marginLeft: 0,
    },
  });
  