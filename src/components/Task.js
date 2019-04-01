/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  ToastAndroid,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { DRAG_BTN } from '../media';
import {
  getDurationText,
  calculateCardHeight,
  checkIfTimeAvailable,
  calculateStartTime,
} from '../utils/Formatter';
import { removeTask, updateTask } from '../actions/TasksAction';
import { setElevatedIndex } from '../actions/DragAnimationActions';
import EditOverlay from './EditTaskOverlay';


class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isElevated: false,
      overlayVisible: false,
    };

    const { y, index } = props.data;
    this.position = new Animated.ValueXY({ x: 0, y });
    this.panResponder = this.createPanResponder(this.position, index);
  }


  componentWillReceiveProps(nextProps) {
    let isElevated = false;
    const { drag: { elevatedIndex } } = nextProps;
    const { data: { index } } = this.props;

    if (elevatedIndex === index) {
      isElevated = true;
    }

    this.setState({ isElevated });
  }


  rerenderNewCardAndUpdateStack = (gestureY) => {
    const {
      drag, tasks,
      updateTask: updateTaskAction,
      scrollHeight,
    } = this.props;
    const { elevatedIndex } = drag;
    const elevatedTask = tasks[elevatedIndex];
    const { style: { height } } = elevatedTask;
    const y = this.position.y._value;

    const tasksCopy = { ...tasks };
    delete tasksCopy[elevatedIndex];

    const available = checkIfTimeAvailable(y, height, tasksCopy);
    const newTask = { ...elevatedTask };


    if (!available) {
      ToastAndroid.show('Can\'t overlap existing tasks!', ToastAndroid.SHORT);
      this.position.setValue({ x: 0, y: y - gestureY });
    } else {
      const startTime = calculateStartTime(y, scrollHeight);
      newTask.y = y;
      newTask.startTime = startTime;
    }

    updateTaskAction(newTask);
  }


  onPanResponderRelease = (position, gesture) => {
    const {
      setElevatedIndex: setElevatedIndexAction,
    } = this.props;
    position.flattenOffset();
    setElevatedIndexAction(-1);
    this.rerenderNewCardAndUpdateStack(gesture.dy);
  }


  createPanResponder = (position, index) => {
    const {
      setElevatedIndex: setElevatedIndexAction,
    } = this.props;
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderGrant: () => {
        const currentY = position.y._value;
        position.setOffset({ x: position.x._value, y: currentY });
        position.setValue({ x: 0, y: 0 });
        setElevatedIndexAction(index);
      },
      onPanResponderRelease: (e, gesture) => {
        this.onPanResponderRelease(position, gesture);
      },
      onPanResponderTerminate: (e, gesture) => {
        this.onPanResponderRelease(position, gesture);
      },
    });

    return panResponder;
  }


  onDelete = () => {
    const { data: { index }, removeTask: removeTaskAction } = this.props;
    removeTaskAction(index);
  }


  onEdit = () => {
    this.setState({ overlayVisible: true });
  }


  PopupMenu = ({ children }) => (
    <Menu>
      <MenuTrigger>
        {children}
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={this.onDelete}>
          <Text style={{ padding: 10 }}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={this.onEdit}>
          <Text style={{ padding: 10 }}>Edit</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  )


  getElevatedCardStyle = (style) => {
    const { isElevated } = this.state;
    const newStyle = { ...style };
    if (isElevated) {
      newStyle.elevation = 5;
      newStyle.left = 10;
      newStyle.right = 10;
    } else {
      newStyle.elevation = 0;
      newStyle.left = 5;
      newStyle.right = 5;
    }

    return newStyle;
  }


  onOverlayBackdropPress = () => {
    this.setState({ overlayVisible: false });
  }


  onEditSavePress = (title, duration) => {
    const {
      data,
      updateTask: updateTaskAction,
      scrollHeight,
      tasks,
    } = this.props;

    const newHeight = calculateCardHeight(duration, scrollHeight);

    const { y } = data;
    const tasksCopy = { ...tasks };
    delete tasksCopy[data.index];

    const available = checkIfTimeAvailable(y, newHeight, tasksCopy);
    if (!available) {
      ToastAndroid.show('Can\'t overlap existing tasks!', ToastAndroid.SHORT);
      return this.setState({ overlayVisible: false });
    }

    const newData = { ...data };
    newData.title = title;
    newData.duration = duration;
    newData.style.height = newHeight;

    updateTaskAction(newData);
    return this.setState({ overlayVisible: false });
  }


  render() {
    const { overlayVisible } = this.state;
    const {
      data: {
        index,
        startTime,
        title,
        duration,
        style,
      },
    } = this.props;

    const newStyle = this.getElevatedCardStyle(style);
    const endMoment = moment(startTime, ['h:mm a']);
    endMoment.add(duration, 'm');

    const endTime = endMoment.format('h:mm a');

    return (
      <Animated.View
        key={index}
        style={{ ...this.position.getLayout(), ...newStyle }}>
        <Image
          {...this.panResponder.panHandlers}
          source={DRAG_BTN}
          style={styles.cardDrag} />
        <View style={styles.cardTop}>
          <Text>{startTime}</Text>
          <this.PopupMenu>
            <Icon
              name="more-vert"
              color="#8493A8" />
          </this.PopupMenu>
        </View>
        <View style={styles.cardTitle}>
          <Text style={{ textAlign: 'center' }}>{title}</Text>
        </View>
        <View style={styles.cardBottom}>
          <Text style={{
            alignSelf: 'flex-start',
          }}>
            {endTime}
          </Text>
          <Text style={{
            marginLeft: 'auto',
          }}>
            {getDurationText(duration)}
          </Text>
        </View>
        <EditOverlay
          title={title}
          duration={duration}
          onSavePress={this.onEditSavePress}
          onBackdropPress={this.onOverlayBackdropPress}
          isVisible={overlayVisible} />
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
    alignSelf: 'stretch',
  },
  cardTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottom: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  cardDrag: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    padding: 10,
    width: 100,
    height: 22,
  },
};


function mapStateToProps(state) {
  const { currentDay, weekPlan } = state.taskData;
  const { tasks } = weekPlan[currentDay];
  return {
    drag: state.drag,
    tasks,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeTask,
    updateTask,
    setElevatedIndex,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Task);
