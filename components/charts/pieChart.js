import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { PieChart, Pie, Sector, YAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';


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

        // label each slice
        const getLabel = (priority) => {
            if (priority <= 25) {
                // return green
                return 'Low';
            } else if (priority > 25 && priority <= 50) {
                // return yellow
                return 'Medium';
            } else if (priority > 50 && priority <= 100) {
                // return red
                return 'High';
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
                        label: item.priority_label,
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
            value: value.occurences,
            svg: {
                fill: getColor(value.priority),
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
            label: `${value.occurences}`
        }))
        console.log(this.props.data);
        console.log(pieData);

        // chart labels
        const Labels = ({slices, height, width}) => slices.map((slice, index) => {
            const { labelCentroid, pieCentroid, data } = slice;
            return (
                <Text
                    key={index}
                    x={labelCentroid[0]}
                    y={labelCentroid[1]}
                    fill={'black'}
                    textAncor={'middle'}
                    alignmentBaseline={'middle'}
                    fontSize={24}
                    stroke={'black'}
                    strokeWidth={0.2}
                >
                    {pieData[index].label}
                </Text>
            );
        });

        return (
            <PieChart
            style={{ height: 200 }}
            data={pieData}
            valueAccessor={({ item }) => item.value}
            innerRadius={'0%'}
            padAngle={0}
            spacing={0}
            labelRadius={ 80 }
            >
                <Labels />
            </PieChart>
         );
    }
}

const styles = StyleSheet.create({
});