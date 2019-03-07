import React, { Component } from 'react';
import { Text, Input, Slider } from 'react-native-elements';
import { View, Keyboard } from 'react-native';
import {  getDurationText, calculateCardHeight } from '../utils/Formatter'


class AddItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            duration: 0, //minutes
        }
    }


    onDurationChanged = (value) => {
        Keyboard.dismiss()
        this.setState({ duration: value })
    }


    getInputCard = () => {
        const { duration, title } = this.state;
        return (
            <View style={styles.card}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Text>Title:</Text>
                    <Input
                        value={title}
                        onChangeText={value => this.setState({ title: value })}
                        containerStyle={{ flex: 1, width: null }}
                        inputStyle={styles.input}
                        placeholder='Your task title'
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Text style={{ marginRight: 10 }}>Duration:</Text>
                    <Slider
                        thumbTintColor='#F5A623'
                        step={5}
                        maximumValue={480}
                        minimumValue={0}
                        value={duration}
                        onValueChange={this.onDurationChanged}
                        style={styles.slider}
                    />
                </View>
                <Text>{getDurationText(duration)}</Text>
            </View>
        );
    }


    getDragCard = (dropWidth) => {
        const { onDragStarted } = this.props;
        const { title, duration } = this.state;

        onDragStarted(title, duration)
        const cardStyle = { ...styles.card };
        cardStyle.width = dropWidth;
        cardStyle.justifyContent = 'center';

        const height = calculateCardHeight(duration);
        cardStyle.height = height;
        return (
            <View style={cardStyle}>
                <Text>{title}</Text>
                <Text>{getDurationText(duration)}</Text>
            </View>
        );
    }


    render() {
        const {
            dragging,
            dropWidth,
            drag,
        } = this.props;

        if (dragging) {
            return this.getDragCard(drag.dropWidth);
        }

        return this.getInputCard();
    }
}


const styles = {
    card: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 130,
        maxHeight: 180,
        alignItems: 'center',
    },
    input: {
        fontSize: 14,
    },
    slider: {
        flex: 1,
        width: null,
        marginRight: 8,
    }
}


export default AddItemCard;