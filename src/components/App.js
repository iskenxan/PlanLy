import React, { Component } from 'react';
import { View, ScrollView, PanResponder, Animated } from 'react-native';
import TimeLine from './Timeline';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../reducers';
import AddItemPanel from './AddItemPanel';


class App extends Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.state = {
      dropWidth: 0,
      dragging: false,
    }
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        const { dragging } = this.state;
        if (!dragging) {
          this.setState({ dragging: true });
        }
        this.position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        this.setState({ dragging: false })
      }
    });
  }


  render() {
    const { dragging, dropWidth } = this.state;
    return (
      <Provider store={createStore(reducers)}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <TimeLine />
            <View style={{ flex: 1, width: null, height: null, backgroundColor: '#A5B3BC' }}
              onLayout={event => {
                let { width } = event.nativeEvent.layout;
                console.log(width)
                this.setState({ dropWidth: width })
              }}>
            </View>
          </ScrollView>
          <AddItemPanel
            dropWidth={dropWidth}
            dragging={dragging}
            layoutStyle={this.position.getLayout()}
            panHandlers={this.panResponder.panHandlers} />
        </View>
      </Provider>
    )
  }
}


styles = {
  scroll: {
    padding: 16,
    backgroundColor: '#F4F7F9',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  }
}

export default App;