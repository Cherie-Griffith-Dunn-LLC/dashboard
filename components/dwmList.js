import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Button, Icon, Modal, Text, Card, Divider } from '@ui-kitten/components';
import GlobalStyles from '../constants/styles';

const data = new Array(20).fill({
  title: 'Credentials Leak',
  description: 'Credentials Leak Description',
  account: 'user@example.com',
  source: 'Dark Net Marketplace'
});

export const DWMList = () => {

  // control modal visibility
  const [visible, setVisible] = React.useState(false);
  // store current data to pass to modal
  const [currentData, setCurrentData] = React.useState(null);

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
        <Icon {...props} name='unlock-outline' />
    );

  const renderItem = ({ item, index }) => (
    <ListItem
    onPress={() => {setVisible(true); setCurrentData(data[index])}}
    title={`${item.title} ${index + 1}`}
    description={`${item.description}`}
    accessoryLeft={renderItemIcon}
    accessoryRight={(props) => renderItemAccessory(props, index)} />
  );

  const cardHeader = (props) => (
    <View {...props} style={[props.style, styles.headerContainer]}>
      <Text category='h6'>{currentData?.title}</Text>
      <Text category='s1'>{currentData?.description}</Text>
    </View>
  );

  const cardFooter = (props) => (
    <View {...props} style={[props.style, styles.cardFooter]}>
      <Button style={[GlobalStyles.button, styles.button]} onPress={() => setVisible(false)}>Close</Button>
    </View>
  );

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
        <Card header={cardHeader} footer={cardFooter} status='danger'>
          <Text>{currentData?.account}</Text>
          <Text>{currentData?.source}</Text>
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