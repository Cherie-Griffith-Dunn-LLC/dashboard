import React from 'react';
import { StyleSheet } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card } from '@ui-kitten/components';

const data = new Array(20).fill({
  title: 'Event',
  event_description: "Action for uploading an object (PUT or POST).",
  account_name: "generic-account",
  plugin_device_type: "Cloud Infrastructure",
  destination_canonical: "s3.amazonaws.com",
  destination_name: "s3.amazonaws.com",
  has_alarm: false,
  request_user_agent: "s3.amazonaws.com",
  packet_type: "log",
  source_canonical: "s3.amazonaws.com",
  event_name: "PutObject",
  timestamp_occured: "1528817037000",
  source_service_name: "s3.amazonaws.com",
  event_type: "AwsApiCall",
  app_name: "amazon-aws",
  timestamp_received: "1528817107938",
  destination_hostname: "s3.amazonaws.com",
  source_infrastructure_name: "Amazon Global",
  plugin: "Amazon AWS CloudTrail",
  app_type: "amazon-aws",
  authentication_type: "AWSService",
  access_control_outcome: "Allow",
  suppressed: "false",
  plugin_device: "CloudTrail",
  destination_infrastructure_type: "Cloud Service",
  source_infrastructure_type: "Cloud Service",
  destination_zone: "us-east-1",
  needs_enrichment: true,
  source_hostname: "s3.amazonaws.com",
  app_id: "amazon-aws",
  plugin_family: "Amazon",
  plugin_version: "0.24",
  destination_userid: "101720206348",
  event_action: "Create",
  destination_infrastructure_name: "Amazon Global",
  source_name: "s3.amazonaws.com",
  received_from: "s3.amazonaws.com"
});

export const DashboardEventsList = () => {

  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState(null);

    const renderItemAccessory = (props, index) => (
        <Button {...props} onPress={() => {setVisible(true); setCurrentData(index)}} size='tiny'>VIEW</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name='question-mark-circle-outline' />
    );

  const renderItem = ({ item, index }) => (
    <ListItem
    title={`${item.title} ${index + 1}`}
    description={`${item.event_description}`}
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
          <Text>Description: {data[currentData]?.event_description}</Text>
          <Text>Account Name: {data[currentData]?.account_name}</Text>
          <Text>Plugin Device Type: {data[currentData]?.plugin_device_type}</Text>
          <Text>Destination Canonical: {data[currentData]?.destination_canonical}</Text>
          <Text>Destination Name: {data[currentData]?.destination_name}</Text>
          <Text>Has Alarm: {data[currentData]?.has_alarm}</Text>
          <Text>Request User Agent: {data[currentData]?.request_user_agent}</Text>
          <Text>Packet Type: {data[currentData]?.packet_type}</Text>
          <Text>Source Canonical: {data[currentData]?.source_canonical}</Text>
          <Text>Event Name: {data[currentData]?.event_name}</Text>
          <Text>Timestamp Occured: {data[currentData]?.timestamp_occured}</Text>
          <Text>Source Service Name: {data[currentData]?.source_service_name}</Text>
          <Text>Event Type: {data[currentData]?.event_type}</Text>
          <Text>App Name: {data[currentData]?.app_name}</Text>
          <Text>Timestamp Received: {data[currentData]?.timestamp_received}</Text>
          <Text>Destination Hostname: {data[currentData]?.destination_hostname}</Text>
          <Text>Source Infrastructure Name: {data[currentData]?.source_infrastructure_name}</Text>
          <Text>Plugin: {data[currentData]?.plugin}</Text>
          <Text>App Type: {data[currentData]?.app_type}</Text>
          <Text>Authentication Type: {data[currentData]?.authentication_type}</Text>
          <Text>Access Control Outcome: {data[currentData]?.access_control_outcome}</Text>
          <Text>Suppressed: {data[currentData]?.suppressed}</Text>
          <Text>Plugin Device: {data[currentData]?.plugin_device}</Text>
          <Text>Destination Infrastructure Type: {data[currentData]?.destination_infrastructure_type}</Text>
          <Text>Source Infrastructure Type: {data[currentData]?.source_infrastructure_type}</Text>
          <Text>Destination Zone: {data[currentData]?.destination_zone}</Text>
          <Text>Needs Enrichment: {data[currentData]?.needs_enrichment}</Text>
          <Text>Source Hostname: {data[currentData]?.source_hostname}</Text>
          <Text>App ID: {data[currentData]?.app_id}</Text>
          <Text>Plugin Family: {data[currentData]?.plugin_family}</Text>
          <Text>Plugin Version: {data[currentData]?.plugin_version}</Text>
          <Text>Destination User ID: {data[currentData]?.destination_userid}</Text>
          <Text>Event Action: {data[currentData]?.event_action}</Text>
          <Text>Destination Infrastructure Name: {data[currentData]?.destination_infrastructure_name}</Text>
          <Text>Source Name: {data[currentData]?.source_name}</Text>
          <Text>Received From: {data[currentData]?.received_from}</Text>
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