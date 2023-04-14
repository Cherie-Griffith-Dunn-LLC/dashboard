import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider, useTheme, Spinner } from '@ui-kitten/components';
// usm api function
import { getAlarms, getDictionaries } from '../../services/usmApi';
import GlobalStyles from '../../constants/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiohazard, faBuildingShield, faBinoculars, faLandMineOn, faTruckRampBox } from '@fortawesome/free-solid-svg-icons';

export const TrainingList = (props) => {
  const theme = useTheme();
  // store data
  const [data, setData] = React.useState([]);
  // store loading state
  const [loading, setLoading] = React.useState(true);
  // store dictionary
  const [dictionary, setDictionary] = React.useState([]);
  // get alarms from api
  React.useEffect(() => {
    const alarms = props.data._embedded.alarms.map(alarm => {
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
      })
      setData(alarms);
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

 
  // if not loading and no adata, show no data text
  if (data.length === 0) {
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