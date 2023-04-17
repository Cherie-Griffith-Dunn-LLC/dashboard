import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider, Spinner } from '@ui-kitten/components';
// usm api function
import { getAllDWM } from '../services/usmApi';
import GlobalStyles from '../constants/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';


export const DWMList = (props) => {

  // store data
  const [data, setData] = React.useState([]);
  // store loading state
  const [loading, setLoading] = React.useState(true);
  // get alarms from api
  React.useEffect(() => {
    getAllDWM(props.token, 20).then((response) => {
      // replace empty data array with response data
      setData(response._embedded.eventResources);
      setLoading(false);
    });
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
      <FontAwesomeIcon {...props} icon={faCircleQuestion} />
    );

    const securityItemIcon = (props) => (
      <FontAwesomeIcon {...props} icon={faShieldHalved} />
  );
 
  const renderItem = ({ item, index }) => (
    <ListItem
    onPress={() => {setVisible(true); setCurrentData(data[index])}}
    title={`${item.source_user_email}`}
    description={`${item.source_dns_domain}`}
    accessoryLeft={renderItemIcon}
    accessoryRight={(props) => renderItemAccessory(props, index)} />
  );

  const cardHeader = (props) => (
    <View {...props} style={[props.style, styles.headerContainer]}>
      <Text category='h6'>{currentData?.source_user_email}</Text>
      <Text category='s1'>{currentData?.source_dns_domain}</Text>
    </View>
  );

  const cardFooter = (props) => (
    <View {...props} style={[props.style, styles.cardFooter]}>
      <Button style={[GlobalStyles.button, styles.button]} onPress={() => setVisible(false)}>Close</Button>
    </View>
  );

  // if loading data, show loading text
  if (loading) {
    return (
      <Text>
          <Spinner size='giant' status='info' />
          Loading...
      </Text>
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
      ItemSeparatorComponent={Divider}
    />
    <Modal
        visible={visible}
        onBackdropPress={() => setVisible(false)}
        backdropStyle={styles.backdrop}
        >
        <Card
          header={cardHeader}
          footer={cardFooter}
          style={GlobalStyles.card}
          status={currentData?.event_severity === 'WARNING' ? 'danger' : (
            currentData?.event_severity === 'Informational' ? 'info' : (
              (currentData?.event_severity === 'ERROR' || currentData?.event_severity === 'UNDEFINED') ? 'warning' : 'basic'
            )
          )}
        >
          <Text>{Math.round((new Date().getTime() - new Date(Math.round(currentData?.timestamp_occured))) / (1000 * 3600 * 24))} days ago.</Text>
          <Text>Event Type: {currentData?.event_type}</Text>
          <Text>Event Source: {currentData?.source_name ? currentData?.source_name : currentData?.source_username}</Text>
          <Text>Packet Type: {currentData?.packet_type}</Text>
        </Card>
    </Modal>
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