import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, Dimensions,
  ToastAndroid,
} from 'react-native';
import TimeLine from './Timeline';
import AddItemPanel from './AddItemPanel';
import TaskContainer from './TaskContainer';
import Header from './Header';
import { checkIfTimeAvailable, calculateCardHeight } from '../utils/Formatter';
import { BG_BLUE } from '../colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;


class Root extends Component {
  constructor(props) {
    super(props);


    this.state = {
      taskDropped: false,
      dropY: -1,
      scrollHeight: 0,
    };

    this.scrollY = 0;
  }


  onTaskDropped = (gestureY) => {
    const { drag: { duration }, tasks } = this.props;
    const { scrollHeight } = this.state;
    const panelY = SCREEN_HEIGHT - 230 - 60 + 30;
    const y = this.scrollY + panelY + gestureY;
    const dropHeight = calculateCardHeight(duration, scrollHeight);
    const available = checkIfTimeAvailable(y, dropHeight, tasks);
    if (available) {
      return this.setState({ taskDropped: true, dropY: y });
    }

    return ToastAndroid.show('Can\'t overlap existing tasks!', ToastAndroid.SHORT);
  }


  onTaskDragStarted = () => {
    this.setState({ taskDropped: false });
  }


  handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    this.scrollY = y;
  }


  handleScrollContentSizeChange = (width, height) => {
    this.setState({ scrollHeight: height });
  }


  render() {
    const {
      taskDropped,
      dropY,
      scrollHeight,
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: BG_BLUE }}>
        <Header />
        <ScrollView
          contentContainerStyle={styles.scroll}
          onScroll={this.handleScroll}
          onContentSizeChange={this.handleScrollContentSizeChange}
        >
          <TimeLine />
          <TaskContainer
            scrollHeight={scrollHeight}
            dropY={dropY}
            taskDropped={taskDropped}
          />
        </ScrollView>
        <AddItemPanel
          onTaskDragStarted={this.onTaskDragStarted}
          onTaskDropped={this.onTaskDropped} />
      </View>
    );
  }
}


const styles = {
  scroll: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: BG_BLUE,
    justifyContent: 'flex-start',
    flexDirection: 'row',
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


export default connect(mapStateToProps)(Root);
