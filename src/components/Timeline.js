import React, { Component } from 'react';
import moment from 'moment';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-elements';


const SECONDS_DAY = 86400;
const SECONDS_HOUR = 3600;
const THRESHOLD = 900;


class TimeLine extends Component {

    getTimes() {
        const times = [];
        let current = moment().startOf('day');
        for (let index = 0; index < SECONDS_DAY; index += THRESHOLD) {
            const text = current.format('h:mm a');
            const item = { text, seconds: index };
            times.push(item);

            current.add(THRESHOLD, 's');
        }

        return times;
    }


    renderTimeDisplays() {
        return this.getTimes().map(item => {
            if (item.seconds % SECONDS_HOUR === 0) {
                return (
                    <View style={styles.itemContainer} key={item.seconds}>
                        <Text style={styles.text} >{item.text}</Text>
                        <View style={styles.circle}></View>
                    </View>
                );
            } else {
                return (
                    <View style={styles.itemContainer} key={item.seconds}>
                        <Text style={styles.text} >{item.text}</Text>
                    </View>
                );
            }
            
        });
    }


    render() {
        const { container } = styles;
        this.getTimes();
        return (
            <View style={{ flexDirection: 'row', width: 50 }}>
                <Divider
                    style={styles.divider}
                />
                <View style={container}>
                    {this.renderTimeDisplays()}
                </View>
            </View>
        )
    }
}


const styles = {
    container: {
        justifyDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        width: 50,
        maxWidth: 50,
        alignSelf: 'flex-start'
    },
    itemContainer: {
        marginBottom: 35,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 50,
        alignItems: 'center'
    },
    text: {
        fontSize:9,
        width: 40,
        maxWidth: 40,
        height: 10,
        color: '#8493A8'
    },
    divider: {
        position: 'absolute',
        right: 1,
        width: 3,
        maxWidth: 3,
        height: '100%',
        backgroundColor: '#FFDDA4',
    },
    circle: {
        height: 5,
        width: 5,
        borderRadius: 3,
        borderWidth: 3,
        borderColor: '#E3910B',
        marginLeft: 'auto',
    }
}

export default TimeLine;