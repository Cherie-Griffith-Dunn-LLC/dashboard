import React from 'react';
import { StyleSheet } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts'

export default class CustomBarChart extends React.Component {


    render() {

        const fill = 'rgb(51, 102, 255)'
        // fake data
        const data = [50, 10, 40, 95, 4, 24, null, 85, undefined, 0, 35, 53, 53, 24, 50, 20, 80]
        const contentInset = { top: 20, bottom: 20, right: 20, left: 20 }
        return (
            <>
            <BarChart style={{ height: 250 }}
            data={data}
            svg={{ fill }}
            contentInset={contentInset}>
            </BarChart>
            <XAxis
            data={data}
            xAccessor={({ item }) => item}
            formatLabel={(value, index) => value}
            svg={{ fontSize: 10, fill: 'black' }}
            contentInset={contentInset}
            />
            </>
         );
    }
}

const styles = StyleSheet.create({
});