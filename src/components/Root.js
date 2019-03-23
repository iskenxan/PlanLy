import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, Dimensions,
} from 'react-native';
import TimeLine from './Timeline';
import AddItemPanel from './AddItemPanel';
import TaskContainer from './TaskContainer';
import Header from './Header';
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
    const panelY = SCREEN_HEIGHT - 230 - 60 + 30;
    const y = this.scrollY + panelY + gestureY;
    this.setState({ taskDropped: true, dropY: y });
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
  return {
    drag: state.drag,
  };
}


export default connect(mapStateToProps)(Root);
