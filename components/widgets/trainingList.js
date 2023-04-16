import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider, useTheme, Spinner, Layout } from '@ui-kitten/components';
// usm api function
import { getAlarms, getDictionaries } from '../../services/usmApi';
import GlobalStyles from '../../constants/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiohazard, faBuildingShield, faBinoculars, faLandMineOn, faTruckRampBox, faUser } from '@fortawesome/free-solid-svg-icons';

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
  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState([]);

  const buttonArrow = (props) => (
    <Icon {...props} name='arrow-ios-forward-outline' />
  );

    const renderItemAccessory = (props, index) => (
        <Button style={GlobalStyles.button}
        {...props} onPress={() => {setVisible(true); setCurrentData(data[index])}}
        accessoryLeft={buttonArrow}
        size='medium' status='basic'></Button>
    );


    const renderItemIcon = (props) => (
      <FontAwesomeIcon {...props} icon={faUser} />
    );
    

  const renderItem = ({ item, index }) => (
    <ListItem
    onPress={() => {setVisible(true); setCurrentData(data[index])}}
    accessoryLeft={renderItemIcon}
    accessoryRight={(props) => renderItemAccessory(props, index)}>
      <Layout style={{ display: 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <Layout  style={{ flex: 1, alignItems: 'flex-start' }}>
        <FontAwesomeIcon icon={faUser} />
        </Layout>
        <Layout style={{ flex: 2, alignItems: 'flex-start' }}>
        <Text>
          {item.name.length <= 20 ? item.name : item.name.substring(0, 20) + '...'}
        </Text>
        </Layout>
        <Layout style={{ flex: 3, alignItems: 'flex-start' }}>
        <Text>
          {item.email.length <= 30 ? item.email : item.email.substring(0, 30) + '...'}
        </Text>
        </Layout>
        <Layout style={{ flex: 1, alignItems: 'flex-start' }}>
        <Text>{item.mostRecentAssignment ? item.mostRecentAssignment : '--/--/----'}</Text>
        </Layout>
        <Layout style={{ flex: 1, alignItems: 'flex-start' }}>
        {item.totalAssignments >= 3 ? (
          <Button style={GlobalStyles.button} status='danger' appearance='outline' size='tiny'>HIGH</Button>
        ) : (
          <Button style={GlobalStyles.button} status='basic' appearance='outline' size='tiny'>LOW</Button>
        )}
        </Layout>
        <Layout style={{ flex: 1, alignItems: 'flex-start' }}>
        <Text>{item.totalAssignments}</Text>
        </Layout>
        <Layout style={{ flex: 1, alignItems: 'flex-end'}}>
        <Button style={GlobalStyles.button}
        onPress={() => {setVisible(true); setCurrentData(data[index])}}
        accessoryLeft={buttonArrow}
        size='medium' status='basic'></Button>
        </Layout>
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