import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { View, Keyboard } from 'react-native';
import { getDurationText } from '../utils/Formatter';
import EditTaskInput from './EditTaskInput';


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


  onTaskTitleChanged = (title) => {
    this.setState({ title });
  }


  getInputCard = () => {
    const { duration, title } = this.state;
    return (
      <View style={styles.card}>
        <EditTaskInput
          name={title}
          onNameChanged={this.onTaskTitleChanged}
          duration={duration}
          onDurationChanged={this.onDurationChanged}
        />
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
};


export default AddItemCard;
