import React from 'react';
import { StyleSheet } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card } from '@ui-kitten/components';

const data = new Array(8).fill({
  title: 'Credentials Leak',
  description: 'Credentials Leak Description',
});

export const DWMList = () => {

  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState(null);

    const renderItemAccessory = (props, index) => (
        <Button {...props} onPress={() => {setVisible(true); setCurrentData(index)}} size='tiny'>VIEW</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name='unlock-outline' />
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