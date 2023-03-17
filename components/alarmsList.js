import React from 'react';
import { StyleSheet } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card } from '@ui-kitten/components';
// usm api function
import { getAlarms } from '../services/usmApi';
import GlobalStyles from '../constants/styles';

export const DashboardAlarmsList = (props) => {
  // store data
  const [data, setData] = React.useState([]);
  // store loading state
  const [loading, setLoading] = React.useState(true);
  // get alarms from api
  React.useEffect(() => {
    getAlarms(props.token).then((response) => {
      // replace empty data array with response data
      setData(response._embedded.alarms);
      setLoading(false);
    });
  }, []);

  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState(null);

    const renderItemAccessory = (props, index) => (
        <Button style={GlobalStyles.button} {...props} onPress={() => {setVisible(true); setCurrentData(index)}} size='tiny'>VIEW</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );

  const renderItem = ({ item, index }) => (
    <ListItem
    title={`${item.rule_strategy}`}
    description={`${item.rule_method}`}
    accessoryLeft={renderItemIcon}
    accessoryRight={(props) => renderItemAccessory(props, index)} />
  );

  // if loading data, show loading text
  if (loading) {
    return (
      <Text>Loading...</Text>
    )
  }
  // if not loading and no adata, show no data text
  if (!loading && data.length === 0) {
    return (
      <Text>No data</Text>
    )
  }
  
  return (
    <>
    <List
      style={styles.container}
      data={data}
      renderItem={renderItem}
    />
    <Modal
        visible={visible}
        onBackdropPress={() => setVisible(false)}
        backdropStyle={styles.backdrop}
        >
        <Card>
          <Text>Title: {data[currentData]?.rule_strategy}</Text>
          <Text>Description: {data[currentData]?.rule_method}</Text>
          <Text>Priority: {data[currentData]?.priority_label}</Text>
          <Text>Rule Intent: {data[currentData]?.rule_intent}</Text>
          <Text>App Type: {data[currentData]?.app_type}</Text>
          <Text>Source Username: {data[currentData]?.source_username}</Text>
          <Text>Security Group ID: {data[currentData]?.security_group_id}</Text>
          <Text>Destination Name: {data[currentData]?.destination_name}</Text>
          <Text>Timestamp Occured: {data[currentData]?.timestamp_occured}</Text>
          <Text>Authentication Type: {data[currentData]?.authentication_type}</Text>
          <Text>Ruled Method: {data[currentData]?.ruled_method}</Text>
          <Text>App ID: {data[currentData]?.app_id}</Text>
          <Text>Source Name: {data[currentData]?.source_name}</Text>
          <Text>Timestamp Received: {data[currentData]?.timestamp_received}</Text>
          <Text>Rule Strategy: {data[currentData]?.rule_strategy}</Text>
          <Text>Request User Agent: {data[currentData]?.request_user_agent}</Text>
          <Text>Rule ID: {data[currentData]?.rule_id}</Text>
          <Text>Sensor UUID: {data[currentData]?.sensor_uuid}</Text>
          <Text>Transient: {data[currentData]?.transient}</Text>
          <Text>Event Name: {data[currentData]?.event_name}</Text>
          <Text>Status: {data[currentData]?.status}</Text>
          <Button onPress={() => setVisible(false)}>Close</Button>
        </Card>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
});