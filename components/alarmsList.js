import React from 'react';
import { StyleSheet } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card } from '@ui-kitten/components';

const data = new Array(20).fill({
  title: 'Alarm',
  description: 'Alarm Description',
  priority: 20,
  priority_label: 'low',
  rule_intent: 'Environmental Awareness',
  app_type: 'amazon-aws',
  source_username: 'user@cgdgovsolutions.com',
  security_group_id: 'sg-xxxxx',
  destination_name: 'ec2.amazonaws.com',
  timestamp_occured: '1517932134000',
  authentication_type: 'IAMUser',
  ruled_method: 'AWS EC2 Security Group Modified',
  app_id: 'amazon-aws',
  source_name: 'x.xx.xx.xxxx',
  timestamp_received: '1517933139670',
  rule_strategy: 'Network Access Control Modification',
  request_user_agent: 'signin.amazonaws.com',
  rule_id: 'AWSEC2SecurityGroupMod',
  sensor_uuid: '433152d2-10ee-4645-8c04-9f8269a447e7',
  transient: false,
  event_name: 'Add inbound network traffic rule to security group',
  status: 'open'
});

export const DashboardAlarmsList = () => {
  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState(null);

    const renderItemAccessory = (props, index) => (
        <Button {...props} onPress={() => {setVisible(true); setCurrentData(index)}} size='tiny'>VIEW</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );

  const renderItem = ({ item, index }) => (
    <ListItem
    title={`${item.title} ${index + 1}`}
    description={`${item.description}`}
    accessoryLeft={renderItemIcon}
    accessoryRight={(props) => renderItemAccessory(props, index)} />
  );

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
          <Text>Title: {data[currentData]?.title} {currentData + 1}</Text>
          <Text>Description: {data[currentData]?.description}</Text>
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