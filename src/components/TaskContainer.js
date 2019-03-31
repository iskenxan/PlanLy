/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import {
  View, Animated, ToastAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { addTask, updateTask } from '../actions/TasksAction';
import { onDropWidth, setElevatedIndex } from '../actions/DragAnimationActions';
import { calculateCardHeight, SECONDS_DAY, checkIfTimeAvailable } from '../utils/Formatter';
import Task from './Task';
import Break from './Break';


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
    } = this.props;
    const { elevatedIndex } = drag;
    const elevatedTask = tasks[elevatedIndex];
    const { style: { height } } = elevatedTask;
    const currentY = elevatedStartY;

    const newY = currentY + gestureY;


    const tasksCopy = { ...tasks };
    delete tasksCopy[elevatedIndex];

    const available = checkIfTimeAvailable(newY, height, tasksCopy);
    const newTask = { ...elevatedTask };
    const { y } = newTask.position;
    const taskY = y._value || y;

    if (!available) {
      ToastAndroid.show('Can\'t overlap existing tasks!', ToastAndroid.SHORT);
      newTask.position.setValue({ x: 0, y: taskY - gestureY });
    } else {
      const startTime = this.calculateStartTime(newY);
      newTask.position.setValue({ x: 0, y: newY });
      newTask.startTime = startTime;
    }

    updateTaskAction(newTask);
  }


  createNewCardAndAddToStack = (y, cardStyle, title, duration, startTime) => {
    const { currentIndex: index, addTask: addTaskAction } = this.props;
    const position = new Animated.ValueXY();
    position.setValue({ x: 0, y });
    const task = {
      index, title, duration, startTime, position, style: cardStyle,
    };
    addTaskAction(task);
  }


  addCard = (height, title, duration, dropY) => {
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


  getTaskTimes = (tasks) => {
    const taskTimes = Object.values(tasks).map((task) => {
      const { position } = task;
      return {
        y: position.y._value || position.y,
        height: task.style.height,
        startTime: task.startTime,
        duration: task.duration,
      };
    });

    taskTimes.sort((a, b) => a.y - b.y);

    return taskTimes;
  }


  handleResponderRelease = (gesture) => {
    const moveY = Math.abs(gesture.dy);
    if (moveY <= 5) {
      return;
    }

    this.rerenderNewCardAndUpdateStack(gesture.dy);
  }


  renderBreaks = (cards, tasks) => {
    const taskTimes = this.getTaskTimes(tasks);

    for (let i = 0; i < taskTimes.length - 1; i += 1) {
      const {
        y: firstTaskY,
        height: startHeight,
        startTime: firstTaskStart,
        duration,
      } = taskTimes[i];
      const { y: endY, startTime: nextTaskStart } = taskTimes[i + 1];
      const breakY = firstTaskY + startHeight;
      const endTime = endY;
      const height = endTime - breakY;

      const startMoment = moment(firstTaskStart, ['h:mm A']);
      startMoment.add(duration, 'm');
      const endMoment = moment(nextTaskStart, ['h:mm A']);

      const breakDuration = endMoment.diff(startMoment, 'm');
      if (breakDuration >= 5) {
        cards.push(
          <Break
            duration={breakDuration}
            key={`b${i}`}
            height={height}
            startY={breakY} />,
        );
      }
    }
  }


  renderStack = () => {
    const { tasks, scrollHeight, drag: { elevatedIndex } } = this.props;
    const cards = Object.values(tasks)
      .map(task => (
        <Task
          key={task.index}
          data={task}
          onElevatedY={newY => this.setState({ elevatedStartY: newY })}
          handleResponderRelease={this.handleResponderRelease}
          scrollHeight={scrollHeight} />
      ));


    if (elevatedIndex !== -1) return cards;
    this.renderBreaks(cards, tasks);

    return cards;
  }


  render() {
    console.log('render');
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
