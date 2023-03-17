import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

export default class CustomLineChart extends React.Component {


    render() {

        // fake data
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        
        // check if data is empty
        if (!this.props.data) {
            var newData = data;
        } else {
            //var newData = this.props.data;
            // parse data to get how many occured on each day then push to newData
            var newData = [];
            var tempData = this.props.data;
            // loop through data
            tempData.forEach((item) => {
                const date = new Date(item.timestamp_occured*1000).getUTCHours();
                // check if date already exists in newData
                var result = newData.find(obj => {
                    return obj.date === date
                });

                // if date doesnt exist in newData, add it
                if (!result) {
                    newData.push({
                        date: date,
                        occurences: 0
                    });
                }

                // add occurences to result
                for (var i = 0; i < newData.length; i++) {
                    if (newData[i].date === date) {
                        newData[i].occurences += 1;
                    }
                }
            });

            // sort newData by date
            newData.sort((a, b) => (a.date > b.date) ? 1 : -1);
        }

        return (
            <LineChart
                style={{ height: 200 }}
                data={ newData }
                xAccessor={({ item }) => item.date}
                yAccessor={({ item }) => item.occurences}
                xMin={0}
                xMax={24}
                curve={ shape.curveNatural }
                svg={{ stroke: 'rgb(51, 102, 255)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid />
            </LineChart>
         );
    }
}

const styles = StyleSheet.create({
});