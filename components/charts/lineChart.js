import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import { Circle, Path } from 'react-native-svg';

export default class CustomLineChart extends React.Component {


    render() {

        // fake data
        const oldData = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        
        // check if data is empty
        if (!this.props.data) {
            var newData = oldData;
        } else {
            //var newData = this.props.data;
            // parse data to get how many occured on each day then push to newData
            // var newData = [{date: 0, occurences: 0}, {date: 24, occurences: 0}];
            var newData = new Array(25).fill().map((value, index) => ({
                date: index,
                occurences: 0
            }))
            var tempData = this.props.data;
            // loop through data
            tempData.forEach((item) => {
                const currentDate = item.timestamp_arrived / 1000;
                const date = new Date(currentDate * 1000).getHours();
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
        // chart line
        const Line = ({ line }) => (
            <Path
                d={ line }
                stroke={ '#0091ff' }
                strokeWidth="3"
                fill={ 'none' }
            />
        )
        // line decorator
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Circle
                    key={ index }
                    cx={ x(value.date) }
                    cy={ y(value.occurences) }
                    r={ value.occurences > 0 ? 4 : 0 }
                    strokeWidth="2.5"
                    stroke={ '#0091ff' }
                    fill={ 'white' }
                />
            ))
        }


        const contentInset = { top: 20, bottom: 20, right: 20, left: 20 }

        

        return (
            <>
            <YAxis
                data={newData}
                yAccessor={({ item }) => item.occurences}
                contentInset={contentInset}
                svg={{
                    fontSize: 10,
                    fill: 'black',
                }}
                // stick to the far left of the container
                style={{
                    position: 'absolute',
                    top: 40,
                    left: 24,
                    height: 200,

                }}
                yMin={0}
                numberOfTicks={5}
            />
            <LineChart
                style={{ height: 200}}
                data={ newData }
                xAccessor={({ item }) => item.date}
                yAccessor={({ item }) => item.occurences}
                xMin={0}
                xMax={24}
                yMin={0}
                xScale={scale.scaleTime}
                curve={ shape.curveNatural }
                contentInset={contentInset}
                numberOfTicks={5}
            >
                <Line />
                <Decorator />
            </LineChart>
            <XAxis
                data={newData}
                xAccessor={({ item }) => item.date}
                formatLabel={(value, index) => {
                    if (value > 12 && (value % 2) !== 0) {
                        return `${value - 12} PM`;
                    } else if (value < 12 && (value % 2) !== 0) {
                        return `${value} AM`;
                    }
                }}
                svg={{
                    fontSize: 10,
                    fill: 'black',
                    rotation: 25,
                    originY: 30,
                    y: 5,
                }}
                scale={scale.scaleTime}
                max={24}
                style={{
                    marginHorizontal: -15,
                    height: 20,
                }}
                contentInset={contentInset}
            />
            </>
         );
    }
}

const styles = StyleSheet.create({
});