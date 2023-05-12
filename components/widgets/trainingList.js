import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider, useTheme, Spinner, Layout, IndexPath } from '@ui-kitten/components';
import GlobalStyles from '../../constants/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserIcon } from '../icons';

function dateParse(mysqlDate) {
  var dateParts = mysqlDate.split("-");
  var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));

  var newDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();


  return newDate;
}

const windowWidth = Dimensions.get('window').width;

export const TrainingList = (props) => {
  const theme = useTheme();
  // store data
  const [data, setData] = React.useState([]);
  // store loading state
  const [loading, setLoading] = React.useState(true);
  // store dictionary
  const [dictionary, setDictionary] = React.useState([]);
  // get employees from api
  React.useEffect(() => {
    const employees = props.data;
    setData(employees);
  }, []);
  // create screenWidth
  const [screenWidth, setScreenWidth] = React.useState(windowWidth);

  React.useEffect(() => {
    // listen for changes to screen size
    const screenSubscription = Dimensions.addEventListener(
      'change',
      ({ window: { width, height } }) => {
        setScreenWidth(width);
      }
    );
    return () => screenSubscription.remove();
  }, []);
  
  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState([]);

  const buttonArrow = (props) => (
    <Icon {...props} name='arrow-ios-forward-outline' />
  );

    const renderItemAccessory = (props, index) => (
        <Button style={GlobalStyles.button}
        {...props} onPress={() => {props.setSelectedIndex(new IndexPath(3))}}
        accessoryLeft={buttonArrow}
        size='medium' status='basic'></Button>
    );


    const renderItemIcon = (props) => (
      <UserIcon {...props} />
    );
    

  const renderItem = ({ item, index }) => (
    <ListItem
    accessoryLeft={renderItemIcon}
    accessoryRight={(props) => renderItemAccessory(props, index)}>
      <Layout style={{ display: 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'nowrap' }}>
        <Layout  style={{ flex: 1, alignItems: 'flex-start' }}>
        <View style={{ height: 44, width: 44, borderRadius: 15, backgroundColor: '#010d27' }}>
          <UserIcon fill="#ffff" style={{ height: 24, width: 24, marginTop: 10, MarginBottom: 10, marginLeft: 12, marginRight: 8 }} />
        </View>
        </Layout>
        <Layout style={{ flex: 3, alignItems: 'flex-start' }}>
        <Text>
          {item.name.length <= 20 ? item.name : item.name.substring(0, 20) + '...'}
        </Text>
        </Layout>
        {screenWidth > 600 ? (
          <>
          <Layout style={{ flex: 3, alignItems: 'flex-start' }}>
          <Text>
            {item.email.length <= 30 ? item.email : item.email.substring(0, 30) + '...'}
          </Text>
          </Layout>
          <Layout style={{ flex: 1, alignItems: 'center' }}>
          <Text>{item.mostRecentCompletion ? dateParse(item.mostRecentCompletion) : '--/--/----'}</Text>
          </Layout>
          </>
          ) : null}
        <Layout style={{ flex: 1, alignItems: 'center' }}>
        {(item.totalAssignments >= 3 &&  item.totalAssignments <= 5) ? (
          <Button style={GlobalStyles.button} status='warning' size='tiny'>MEDIUM</Button>
        ) : (item.totalAssignments > 5) ? (
            <Button style={GlobalStyles.button} status='danger' size='tiny'>HIGH</Button>
          ) : (
            <Button style={GlobalStyles.button} status='success' size='tiny'>LOW</Button>
          )
        }
        </Layout>
        <Layout style={{ flex: 1, alignItems: 'center' }}>
        <Text>{item.totalAssignments}</Text>
        </Layout>
        {screenWidth > 600 ? (
          <Layout style={{ flex: 1, alignItems: 'flex-end'}}>
          <Button style={GlobalStyles.button}
          onPress={() => {props.setSelectedIndex(new IndexPath(3))}}
          accessoryRight={buttonArrow}
          appearance='outline'
          size='small' status='basic'>Details</Button>
          </Layout>
          ) : null}
      </Layout>
    </ListItem>
  );

  const cardHeader = (props) => (
    <View {...props} style={[props.style, styles.headerContainer]}>
      <Text category='h6'>{currentData?.rule_strategy}</Text>
      <Text category='s1'>{currentData?.rule_method}</Text>
    </View>
  );

  const cardFooter = (props) => (
    <View {...props} style={[props.style, styles.cardFooter]}>
      <Button style={[GlobalStyles.button, styles.button]} onPress={() => setVisible(false)}>Close</Button>
    </View>
  );

 
  // if not loading and no adata, show no data text
  if (data?.length === 0) {
    return (
      <Text>No data</Text>
    )
  }
  
  return (
    <>
    <Layout style={{ paddingLeft: 80, paddingRight: 90, display: 'flex', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
      <Text category='label' style={{ flex: 3, alignSelf: 'flex-start' }}>{screenWidth > 768 ? 'Employee Name' : 'Name'  }</Text>
      {screenWidth > 768 ? (
        <>
          <Text category='label' style={{ flex: 3, alignSelf: 'flex-end' }}>Email</Text>
          <Text category='label' style={{ flex: 1, alignSelf: 'flex-end' }}>Last Course Completed</Text>
        </>
      ) : null}
      <Text category='label' style={{ flex: 1, alignSelf: 'flex-end' }}>{screenWidth > 768 ? 'Risk Status' : 'Risk'  }</Text>
      <Text category='label' style={{ flex: 1, alignSelf: 'flex-end' }}>Total Courses</Text>
    </Layout>
    <List
      style={styles.container}
      numColumns={1}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
    />
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
      width: '140px',
      height: '25px'
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
});