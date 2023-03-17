import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PieChart, Pie, Sector } from 'react-native-svg-charts';

export default class CustomPieChart extends React.Component {


    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]


        // color each slice
        const getColor = (priority) => {
            if (priority <= 25) {
                // return green
                return 'rgb(26, 213, 152)';
            } else if (priority > 25 && priority <= 50) {
                // return yellow
                return 'rgb(0, 144, 255)';
            } else if (priority > 50 && priority <= 100) {
                // return red
                return 'rgb(219, 90, 238)';
            }
        }
       
        if (!this.props.data) {
            var newData = data;
        } else {
            var tempData = this.props.data;
            var newData = [];
            // loop through data
            tempData.forEach((item) => {
                const priority = item.priority;
                // check if date already exists in newData
                var result = newData.find(obj => {
                    return obj.priority === priority
                });

                // if date doesnt exist in newData, add it
                if (!result) {
                    newData.push({
                        priority: priority,
                        occurences: 0
                    });
                }

                // add occurences to result
                for (var i = 0; i < newData.length; i++) {
                    if (newData[i].priority === priority) {
                        newData[i].occurences += 1;
                    }
                }
            });
            console.log(newData);
        }
        const pieData = newData
        .filter((value) => value.priority > 0)
        .map((value, index) => ({
            value: value.priority,
            svg: {
                fill: getColor(value.priority),
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
        }))
        console.log(this.props.data);
        console.log(pieData);

        return (
            <PieChart
            style={{ height: 200 }}
            data={pieData}
            xAccessor={({ item }) => item.key}
            yAccessor={({ item }) => item.value.priority}
            innerRadius={'0%'}
            padAngle={0}
            />
         );
    }
}

const styles = StyleSheet.create({
});