import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, PanResponder, Animated, Dimensions } from 'react-native';
import TimeLine from './Timeline';
import AddItemPanel from './AddItemPanel';
import TaskContainer from './TaskContainer'

const SCREEN_HEIGHT = Dimensions.get('window').height;


class Root extends Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY();

        this.state = {
            dropWidth: 0,
            dragging: false,
            taskDropped: false,
            dropY: -1,
            scrollY: 0,
        }

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const { dragging } = this.state;
                if (!dragging) {
                    this.setState({ dragging: true, taskDropped: false });
                }
                this.position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (e, gesture) => {
                console.log(gesture)
                const gestureY = gesture.dy;
                console.log(`height: ${SCREEN_HEIGHT}`)
                console.log('gesture: ' + gestureY)
                if (gestureY < -210) {
                    const { scrollY } = this.state;
                    console.log(`scroll: ${scrollY}`)
                    // const screenY = SCREEN_HEIGHT - (gestureY * -1);
                    const screenY = gesture.moveY;
                    const y = scrollY + screenY;
                    console.log(`dropY:${y}`)
                    this.setState({ dragging: false, taskDropped: true, dropY: y })
                } else {
                    this.setState({ dragging: false })
                }
                this.position.setValue({ x: 0, y: 0 });
            }
        });
    }


    handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        console.log(`scrolling:${y}`)
        this.setState({ scrollY: y })
    }


    render() {
        const { dragging, dropWidth, taskDropped, dropY } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    onScroll={this.handleScroll}>
                    <TimeLine />
                    <TaskContainer
                        dropY={dropY}
                        taskDropped={taskDropped} />
                </ScrollView>
                <AddItemPanel
                    dropWidth={dropWidth}
                    dragging={dragging}
                    layoutStyle={this.position.getLayout()}
                    panHandlers={this.panResponder.panHandlers} />
            </View>
        )
    }
}


const styles = {
    scroll: {
        padding: 16,
        backgroundColor: '#F4F7F9',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    }
}


function mapStateToProps(state) {
    return {
        drag: state.drag,
    }
}


export default connect(mapStateToProps)(Root);