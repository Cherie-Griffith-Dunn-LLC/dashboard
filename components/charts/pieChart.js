import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { PieChart, Pie, Sector, YAxis, XAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';
import { Layout } from '@ui-kitten/components';


export default class CustomPieChart extends React.Component {



    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]


        // color each slice
        const getColor = (priority) => {
            if (priority === 'low') {
                // return green
                return '#3f9463';
            } else if (priority === 'medium') {
                // return yellow
                return '#cc7631';
            } else if (priority === 'high') {
                // return red
                return '#cf4039';
            }
        }

        // label each slice
        const getArc = (priority) => {
            if (priority === 'low') {
                // return green
                return {};
            } else if (priority === 'medium') {
                // return yellow
                return {};
            } else if (priority === 'high') {
                // return red
                return {
                    outerRadius: '110%',
                    innerRadius: '60%',
                    padAngle: '0.1'
                };
            }
        }
       var total = 0;
        if (!this.props.data) {
            var newData = data;
        } else {
            var tempData = this.props.data;
            var newData = [];
            // loop through data
            tempData.forEach((item) => {
                total += 1;
                const priority = item.priority_label;
                // check if date already exists in newData
                var result = newData.find(obj => {
                    return obj.priority === priority
                });

                // if date doesnt exist in newData, add it
                if (!result) {
                    newData.push({
                        priority: priority,
                        label: item.priority,
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
        }
        const pieData = newData
        // .filter((value) => value.priority > 0)
        .map((value, index) => ({
            value: value.occurences,
            svg: {
                fill: getColor(value.priority),
                onPress: () => console.log('press', index),
            },
            //arc: getArc(value.priority),
            key: `${value.label}`,
            label: `${value.occurences}`
        }))

        const contentInset = { top: 20, bottom: 20, right: 20, left: 20 }

        // chart labels
        const Labels = ({slices, height, width}) => slices.map((slice, index) => {
            const { labelCentroid, pieCentroid, data } = slice;
            return (
                <Text
                    key={index}
                    x={pieCentroid[0] - 5}
                    y={pieCentroid[1]}
                    fill={'white'}
                    textAncor={'middle'}
                    alignmentBaseline={'middle'}
                    fontSize={24}
                    fontWeight={'bold'}
                    stroke={'black'}
                    strokeWidth={0.2}
                >
                    {pieData[index].label}
                </Text>
            );
        });

        return (
            <View style={styles.container}>
                <PieChart
                style={{ height: 250, width: 200 }}
                data={pieData}
                valueAccessor={({ item }) => item.value}
                padAngle={0}
                spacing={0}
                labelRadius={ 80 }
                contentInset={contentInset}
                >
                    <Labels />
                    <Text
                        category='h2'
                        style={{
                            position: 'absolute',
                            fontSize: 24,
                        }}
                    >
                        {total ? total : '0'}
                    </Text>
                </PieChart>
            </View>
         );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
});