import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { addTask, updateTask } from '../actions/TasksAction';
import { onDropWidth, setElevatedIndex } from '../actions/DragAnimationActions';
import {
  calculateCardHeight,
  calculateStartTime,
} from '../utils/Formatter';
import Task from './Task';
import { renderBreaks } from './Break';
import {
  createTaskNotification,
  addNotificationsForAllTasks,
  cancelAllNotifications,
} from '../utils/PushNotifications';


class TaskContainer extends Component {
  componentWillReceiveProps(nextProps) {
    const {
      taskDropped,
      drag,
      settings: { notifications },
      scrollHeight,
      weekPlan,
    } = this.props;
    const {
      taskDropped: nextTaskDropped,
      dropY: nextDropY,
      weekPlan: nextWeekPlan,
    } = nextProps;
    if (nextTaskDropped && !taskDropped) {
      const { duration, title } = drag;
      const height = calculateCardHeight(duration, scrollHeight);
      this.addCard(height, title, duration, nextDropY);
    }

    if (notifications && !_.isEqual(nextWeekPlan, weekPlan)) {
      console.log('update notifications');
      cancelAllNotifications();
      addNotificationsForAllTasks(nextWeekPlan, scrollHeight);
    }
  }


  createNewCardAndAddToStack = (y, style, title, duration) => {
    const {
      currentIndex: index,
      addTask: addTaskAction,
      currentDay,
      scrollHeight,
      settings: { notifications },
    } = this.props;
    const startTime = calculateStartTime(y, scrollHeight);
    const task = {
      index,
      title,
      duration,
      startTime,
      y,
      style,
    };

    if (notifications) {
      createTaskNotification(currentDay, startTime, title);
    }

    addTaskAction(task);
  }


  addCard = (height, title, duration, dropY) => {
    const cardStyle = { ...styles.card };
    cardStyle.height = height;

    this.createNewCardAndAddToStack(dropY, cardStyle, title, duration);
  }


  onLayout = (event) => {
    const { onDropWidth: onDropWidthAction } = this.props;
    const { width } = event.nativeEvent.layout;
    onDropWidthAction(width);
  }


  renderStack = () => {
    const { tasks, scrollHeight, drag: { elevatedIndex } } = this.props;
    let cards = Object.values(tasks)
      .map(task => (
        <Task
          key={task.index}
          data={task}
          tasks={tasks}
          scrollHeight={scrollHeight} />
      ));

    if (elevatedIndex !== -1) return cards;

    const breaks = renderBreaks(tasks, scrollHeight);

    cards = [...cards, ...breaks];

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
    tasks: weekPlan[currentDay].tasks,
    currentIndex: weekPlan[currentDay].currentIndex,
    currentDay,
    settings: state.settings,
    weekPlan,
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
