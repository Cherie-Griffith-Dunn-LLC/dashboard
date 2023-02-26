import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PieChart, Pie, Sector } from 'react-native-svg-charts';

export default class CustomPieChart extends React.Component {


    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        // color each slice
        const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

        const pieData = data
        .filter((value) => value > 0)
        .map((value, index) => ({
            value,
            svg: {
                fill: randomColor(),
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
        }))
        

        return (
            <PieChart style={{ height: 200 }} data={pieData} />
         );
    }
}

const styles = StyleSheet.create({
});