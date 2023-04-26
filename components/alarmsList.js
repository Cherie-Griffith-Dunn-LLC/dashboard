import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider, useTheme, Spinner } from '@ui-kitten/components';
// usm api function
import { getAlarms, getDictionaries } from '../services/usmApi';
import GlobalStyles from '../constants/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiohazard, faBuildingShield, faBinoculars, faLandMineOn, faTruckRampBox } from '@fortawesome/free-solid-svg-icons';

export const DashboardAlarmsList = (props) => {
  const theme = useTheme();
  // store data
  const [data, setData] = React.useState([]);
  // store loading state
  const [loading, setLoading] = React.useState(true);
  // store dictionary
  const [dictionary, setDictionary] = React.useState([]);
  // get alarms from api
  React.useEffect(() => {
    // check if alarms where passed in props
    if (props.data.page?.totalElements) {
      const alarms = props.data._embedded?.alarms.map(alarm => {
        if (alarm.rule_intent === 'System Compromise') {
          return {
            ...alarm,
            icon: 'compromise'

          }
        } else if (alarm.rule_intent === 'Environmental Awareness') {
          return {
            ...alarm,
            icon: 'environment'
          }
        } else if (alarm.rule_intent === 'Exploit & Installation') {
          return {
            ...alarm,
            icon: 'exploit'
          }
        } else if (alarm.rule_intent === 'Delivery & Attack') {
          return {
            ...alarm,
            icon: 'attack'
          }
        } else if (alarm.rule_intent === 'Reconnaisannce & Probing') {
          return {
            ...alarm,
            icon: 'recon'
          }
        } else {
          return {
            ...alarm
          }
        }
      });
      setData(alarms);
      setLoading(false);
    }
     
    getAlarms(props.token, 20).then((response) => {
      // replace empty data array with response data
      // for each item in alarms map onto it an icon and status based on rule intent
      const alarms = response._embedded.alarms.map(alarm => {
        if (alarm.rule_intent === 'System Compromise') {
          return {
            ...alarm,
            icon: 'compromise'

          }
        } else if (alarm.rule_intent === 'Environmental Awareness') {
          return {
            ...alarm,
            icon: 'environment'
          }
        } else if (alarm.rule_intent === 'Exploit & Installation') {
          return {
            ...alarm,
            icon: 'exploit'
          }
        } else if (alarm.rule_intent === 'Delivery & Attack') {
          return {
            ...alarm,
            icon: 'attack'
          }
        } else if (alarm.rule_intent === 'Reconnaisannce & Probing') {
          return {
            ...alarm,
            icon: 'recon'
          }
        } else {
          return {
            ...alarm
          }
        }
      });
      setData(alarms);
      setLoading(false);

      if (response.page?.totalElements > 0) {
        // get dictionary
        getDictionaries(props.token).then((response) => {
          setDictionary(response);
        });
      }
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

    const compromiseItemIcon = (props) => (
      <FontAwesomeIcon {...props} size="lg" icon={faBiohazard} style={{ color: theme['color-danger-500'] }} />
  );

  const EnvironmentalItemIcon = (props) => (
    <FontAwesomeIcon {...props} size="xs" icon={faBuildingShield} />
  );

  const ReconItemIcon = (props) => (
    <FontAwesomeIcon {...props} icon={faBinoculars} />
  );

  const ExploitItemIcon = (props) => (
    <FontAwesomeIcon {...props} icon={faLandMineOn} />
  );

  const AttackItemIcon = (props) => (
    <FontAwesomeIcon {...props} icon={faTruckRampBox} />
  );

    const renderItemIcon = (props) => (
      <Icon {...props} name='alert-circle-outline' />
    );

    // function to get days ago from date
    const daysAgo = (date) => {
      // Math.round((new Date().getTime() - new Date(Math.round(currentData?.timestamp_occured))) / (1000 * 3600 * 24))
      const days = Math.round((new Date().getTime() - new Date(Math.round(date))) / (1000 * 3600 * 24));
      if (days === 0) {
        // return the local time of the date
        return new Date(Math.round(date)).toLocaleTimeString();
      } else {
        return `${days} days ago`;
      }
    };
    

  const renderItem = ({ item, index }) => (
    <ListItem
    onPress={() => {setVisible(true); setCurrentData(data[index])}}
    title={`${item.rule_strategy}`}
    description={`${item.rule_method}`}
    accessoryLeft={
      item.icon === 'compromise' ? compromiseItemIcon : (
        item.icon === 'environment' ? EnvironmentalItemIcon : (
          item.icon === 'recon' ? ReconItemIcon : (
            item.icon === 'exploit' ? ExploitItemIcon : (
              item.icon === 'attack' ? AttackItemIcon : renderItemIcon
            )
          )
        )
      )}
    accessoryRight={(props) => renderItemAccessory(props, index)} />
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
        style={{height: '90%', width: '90%'}}
        >
        <Card
          style={currentData?.priority_label === 'high' ? [GlobalStyles.card, {borderWidth: 2, borderColor: theme['color-danger-500']}] : (
            currentData?.priority_label === 'medium' ? [GlobalStyles.card, {borderWidth: 2, borderColor: theme['color-warning-500']}] : [GlobalStyles.card, {borderWidth: 2, borderColor: theme['color-info-500']}]
          )}
          header={cardHeader} footer={cardFooter}
          status={currentData?.priority_label === 'high' ? 'danger' : (
            currentData?.priority_label === 'medium' ? 'warning' : 'info'
          )}
        >
          <Text category='h6'>Alarm Details:</Text>
          <Divider style={GlobalStyles.divider} />
          <Text>{daysAgo(currentData?.timestamp_occured)}</Text>
          <Text>Priority: {currentData?.priority_label === 'high' ? (
            <Button style={GlobalStyles.button} status='danger' appearance='outline' size='tiny'>{currentData?.priority_label?.toUpperCase()}</Button>
          ) : (
            <Button style={GlobalStyles.button} status='basic' appearance='outline' size='tiny'>{currentData?.priority_label?.toUpperCase()}</Button>
          )}
          </Text>
          <Text>Status: {currentData?.status}</Text>
          {currentData?.icon === 'compromise' ? (
            <>
            <Text>Username: {currentData?.source_username}</Text>
            <Text>Source NT Domain: {currentData?.source_ntdomain}</Text>
            <Text>File Name: {currentData?.file_name}</Text>
            <Text>Malware Family: {currentData?.malware_family}</Text>
            </>
          ) : (
            <>
            <Text>Destination Username: {currentData?.destination_username}</Text>
            <Text>Audit Reason: {currentData?.audit_reason}</Text>
            <Text>Rule Attack Tactic: {currentData?.rule_attack_tactic}</Text>
            <Text>Rule Attack Technique: {currentData?.rule_attack_technique}</Text>
            </>
          )}
          <Text>Sensors: {currentData?.sensor_uuid}</Text>
          <Divider style={GlobalStyles.divider} />
          <Text category='h6'>Description:</Text>
          <Text category='s1'>Method:</Text>
          <Text category='p1'>{dictionary[currentData?.rule_dictionary]?.Method[currentData?.rule_method]}</Text>
          <Text category='s1'>Strategy:</Text>
          <Text category='p1'>{dictionary[currentData?.rule_dictionary]?.Strategy[currentData?.rule_strategy]}</Text>
          <Text category='s1'>Intent:</Text>
          <Text category='p1'>{dictionary[currentData?.rule_dictionary]?.Intent[currentData?.rule_intent]}</Text>
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