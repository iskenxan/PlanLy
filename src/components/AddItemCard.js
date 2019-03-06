import React, { Component } from 'react';
import { Text, Input, Slider } from 'react-native-elements';
import { View, Keyboard } from 'react-native';



class AddItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            duration: 0, //minutes
        }
    }


    getDurationText = (duration) => {
        duration = Math.floor(duration);

        if (duration < 60) {
            return `${duration} mins`
        }
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (minutes === 0) {
            return `${hours} hr`;
        }

        return `${hours} hr, ${minutes} mins`;
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
                <Text>{this.getDurationText(duration)}</Text>
            </View>
        );
    }


    getDragCard = (dropWidth) => {
        const { title, duration } = this.state;
        const cardStyle = { ...styles.card };
        cardStyle.width = dropWidth;
        cardStyle.justifyContent = 'center';
        return (
            <View style={cardStyle}>
                <Text>{title}</Text>
                <Text>{this.getDurationText(duration)}</Text>
            </View>
        );
    }


    render() {
        const {
            dragging,
            dropWidth
        } = this.props;

        if (dragging) {
            return this.getDragCard(dropWidth);
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
        maxHeight: 130,
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