/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { addTask, updateTask } from '../actions/TasksAction';
import { onDropWidth, setElevatedIndex } from '../actions/DragAnimationActions';
import { calculateCardHeight, SECONDS_DAY } from '../utils/Formatter';
import Task from './Task';


class TaskContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elevatedStartY: 0,
    };
  }


  componentWillReceiveProps(props) {
    const { taskDropped, drag } = this.props;
    if (props.taskDropped && !taskDropped) {
      const { scrollHeight } = props;
      const { duration, title } = drag;
      const height = calculateCardHeight(duration, scrollHeight);
      this.addCard(height, title, duration, props.dropY);
    }
  }


  calculateStartTime = (y) => {
    const { scrollHeight } = this.props;
    const unit = Math.fround(SECONDS_DAY / scrollHeight);
    const seconds = y * unit;

    const current = moment().startOf('day');
    current.add(seconds, 'S');
    let minutes = current.get('minutes');
    minutes = Math.floor(minutes / 5) * 5;
    current.set('minutes', minutes);

    const text = current.format('h:mm a');

    return text;
  }


  rerenderNewCardAndUpdateStack = (gestureY) => {
    const { elevatedStartY } = this.state;
    const {
      drag, tasks,
      updateTask: updateTaskAction,
      setElevatedIndex: setElevatedIndexAction,
    } = this.props;
    const { elevatedIndex } = drag;
    const elevatedTask = tasks[elevatedIndex];
    const currentY = elevatedStartY;

    const newY = currentY + gestureY;

    const startTime = this.calculateStartTime(newY);

    const newTask = { ...elevatedTask, startTime };
    updateTaskAction(newTask);
    setElevatedIndexAction(-1);
  }


  createPanResponder = (index) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (event, gesture) => {
        const { drag, tasks } = this.props;
        const { elevatedIndex } = drag;
        const { position } = tasks[elevatedIndex];
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderGrant: () => {
        const { tasks, setElevatedIndex: setElevatedIndexAction } = this.props;
        const task = tasks[index];
        const { position } = task;
        const currentY = position.y._value;

        position.setOffset({ x: position.x._value, y: currentY });
        position.setValue({ x: 0, y: 0 });
        setElevatedIndexAction(task.index);
        this.setState({ elevatedStartY: currentY });
      },
      onPanResponderRelease: (e, gesture) => {
        this.handleResponderRelease(gesture);
      },
      onPanResponderTerminate: (e, gesture) => {
        this.handleResponderRelease(gesture);
      },
    });

    return panResponder;
  }


  createNewCardAndAddToStack = (y, cardStyle, title, duration, startTime) => {
    const { currentIndex: index, addTask: addTaskAction } = this.props;
    const position = new Animated.ValueXY();
    position.setValue({ x: 0, y });
    const panResponder = this.createPanResponder(index);
    const task = {
      index, title, duration, startTime, position, panResponder, style: cardStyle,
    };
    addTaskAction(task);
  }


  addCard = (height, title, duration, dropY) => {
    console.log('new Task');
    const cardStyle = { ...styles.card };
    cardStyle.height = height;
    const startTime = this.calculateStartTime(dropY);

    this.createNewCardAndAddToStack(dropY, cardStyle, title, duration, startTime);
  }


  onLayout = (event) => {
    const { onDropWidth: onDropWidthAction } = this.props;
    const { width } = event.nativeEvent.layout;
    onDropWidthAction(width);
  }


  handleResponderRelease(gesture) {
    const {
      drag: { elevatedIndex }, tasks,
      setElevatedIndex: setElevatedIndexAction,
    } = this.props;
    const { position } = tasks[elevatedIndex];
    const moveY = Math.abs(gesture.dy);
    position.flattenOffset();

    if (moveY <= 5) {
      return setElevatedIndexAction(-1);
    }
    return this.rerenderNewCardAndUpdateStack(gesture.dy);
  }


  renderStack = () => {
    const { tasks } = this.props;
    const cards = Object.values(tasks).map((task) => {
      const card = (<Task key={task.index} data={task} />);
      return card;
    });

    return cards;
  }


  render() {
    return (
      <View onLayout={this.onLayout} style={styles.container}>
        {this.renderStack()}
      </View>
    );
  }
}


const styles = {
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    alignItems: 'center',
    left: 5,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
};


function mapStateToProps(state) {
  const { weekPlan, currentDay } = state.taskData;
  return {
    drag: state.drag,
    currentDay: state.taskData.currentDay,
    tasks: weekPlan[currentDay].tasks,
    currentIndex: weekPlan[currentDay].currentIndex,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onDropWidth,
    addTask,
    updateTask,
    setElevatedIndex,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer);
