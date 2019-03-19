import React, { Component } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { DRAG_BTN } from '../media'
import { Icon } from 'react-native-elements'
import { getDurationText } from '../utils/Formatter';


class Task extends Component {

    render() {
        const {
            index,
            style,
            position,
            panResponder,
            startTime,
            title,
            duration
        } = this.props.data;

        return (
            <Animated.View
                key={index}
                style={{ ...position.getLayout(), ...style }}>
                <Image
                    {...panResponder.panHandlers}
                    source={DRAG_BTN}
                    style={styles.cardDrag} />
                <View style={styles.cardTop}>
                    <Text>{startTime}</Text>
                    <Icon
                        name='more-vert'
                        color='#8493A8' />
                </View>
                <View style={styles.cardTitle}>
                    <Text style={{ textAlign: 'center' }}>{title}</Text>
                </View>
                <Text style={styles.cardBottom}>{getDurationText(duration)}</Text>
            </Animated.View>
        );
    }
}


const styles = {
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        height: 20,
        alignSelf: 'stretch'
    },
    cardTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardBottom: {
        alignSelf: 'stretch',
        textAlign: 'right'
    },
    cardDrag: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0,
        width: 75,
        height: 17,
    }
}

export default Task;