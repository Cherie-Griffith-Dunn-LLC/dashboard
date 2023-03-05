import React from 'react';
import { StyleSheet } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card } from '@ui-kitten/components';

const data = new Array(8).fill({
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
          <Text>{data[currentData]?.title} {currentData + 1}</Text>
          <Text>{data[currentData]?.description}</Text>
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