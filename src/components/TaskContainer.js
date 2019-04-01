/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { addTask, updateTask } from '../actions/TasksAction';
import { onDropWidth, setElevatedIndex } from '../actions/DragAnimationActions';
import { calculateCardHeight, calculateStartTime } from '../utils/Formatter';
import Task from './Task';
import Break from './Break';


class TaskContainer extends Component {
  componentWillReceiveProps(props) {
    const { taskDropped, drag } = this.props;
    if (props.taskDropped && !taskDropped) {
      const { scrollHeight } = props;
      const { duration, title } = drag;
      const height = calculateCardHeight(duration, scrollHeight);
      this.addCard(height, title, duration, props.dropY);
    }
  }


  createNewCardAndAddToStack = (y, cardStyle, title, duration, startTime) => {
    const { currentIndex: index, addTask: addTaskAction } = this.props;
    const task = {
      index, title, duration, startTime, y, style: cardStyle,
    };
    addTaskAction(task);
  }


  addCard = (height, title, duration, dropY) => {
    const { scrollHeight } = this.props;
    const cardStyle = { ...styles.card };
    cardStyle.height = height;
    const startTime = calculateStartTime(dropY, scrollHeight);

    this.createNewCardAndAddToStack(dropY, cardStyle, title, duration, startTime);
  }


  onLayout = (event) => {
    const { onDropWidth: onDropWidthAction } = this.props;
    const { width } = event.nativeEvent.layout;
    onDropWidthAction(width);
  }


  getTaskTimes = (tasks) => {
    const taskTimes = Object.values(tasks).map((task) => {
      const {
        y,
        style: { height },
        startTime,
        duration,
      } = task;
      return {
        y,
        height,
        startTime,
        duration,
      };
    });

    taskTimes.sort((a, b) => a.y - b.y);

    return taskTimes;
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
      const height = endY - breakY;

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
          tasks={tasks}
          scrollHeight={scrollHeight} />
      ));


    if (elevatedIndex !== -1) return cards;
    this.renderBreaks(cards, tasks);

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
