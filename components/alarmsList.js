import React from 'react';
import { StyleSheet } from 'react-native';
import { List, ListItem, Button, Icon } from '@ui-kitten/components';

const data = new Array(8).fill({
  title: 'Alarm',
  description: 'Alarm Description',
});

export const DashboardAlarmsList = () => {

    const renderItemAccessory = (props) => (
        <Button {...props} size='tiny'>VIEW</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );

  const renderItem = ({ item, index }) => (
    <ListItem
    title={`${item.title} ${index + 1}`}
    description={`${item.description}`}
    accessoryLeft={renderItemIcon}
    accessoryRight={renderItemAccessory} />
  );

  return (
    <List
      style={styles.container}
      data={data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});