import React, { Component } from 'react';
import { Text, Input, Slider } from 'react-native-elements';
import { View, Keyboard } from 'react-native';
import { getDurationText } from '../utils/Formatter';
import { ACCENT_ORANGE } from '../colors';


class AddItemCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      duration: 0, // minutes
    };
  }


  componentWillReceiveProps(props) {
    const { dragging, onDragStarted } = this.props;
    if (props.dragging && !dragging) {
      const { title, duration } = this.state;
      onDragStarted(title, duration);
    }
  }


    onDurationChanged = (value) => {
      Keyboard.dismiss();
      this.setState({ duration: value });
    }


    getInputCard = () => {
      const { duration, title } = this.state;
      return (
        <View style={styles.card}>
          <View style={styles.centeredContent}>
            <Text>Title:</Text>
            <Input
              value={title}
              onChangeText={value => this.setState({ title: value })}
              containerStyle={{ flex: 1, width: null }}
              inputStyle={styles.input}
              placeholder="Your task title"
            />
          </View>
          <Text style={{ marginTop: 15 }}>{getDurationText(duration)}</Text>
          <View style={styles.centeredContent}>
            <Text style={{ marginRight: 10 }}>Duration:</Text>
            <Slider
              thumbTintColor={ACCENT_ORANGE}
              step={5}
              maximumValue={480}
              minimumValue={15}
              value={duration}
              onValueChange={this.onDurationChanged}
              style={styles.slider}
            />
          </View>
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
          <Text>{getDurationText(duration)}</Text>
        </View>
      );
    }


    render() {
      const {
        dragging,
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
    maxHeight: 15,
    padding: 1,
  },
  slider: {
    flex: 1,
    width: null,
    marginRight: 8,
    padding: 1,
  },
  centeredContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};


export default AddItemCard;
