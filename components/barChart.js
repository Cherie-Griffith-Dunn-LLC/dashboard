import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts'

export default class CustomBarChart extends React.Component {


    render() {

        const fill = 'rgb(134, 65, 244)'
        // fake data
        const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]

        return (
            <BarChart style={{ height: 200 }}
            data={data}
            svg={{ fill }}
            contentInset={{ top: 30, bottom: 30 }}>
                <Grid />
            </BarChart>
         );
    }
}

const styles = StyleSheet.create({
});