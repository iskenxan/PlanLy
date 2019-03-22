import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, PanResponder, Animated, Dimensions } from 'react-native';
import TimeLine from './Timeline';
import AddItemPanel from './AddItemPanel';
import TaskContainer from './TaskContainer';

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
            scrollHeight: 0,
            panelVisible: false,
        }

        this.scrollY = 0;
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
                this.position.flattenOffset();
                const gestureY = gesture.dy;
                if (gestureY < -150) {
                    const panelY = SCREEN_HEIGHT - 210 + 30;
                    const y = this.scrollY + panelY + gestureY;
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
        this.scrollY = y;
    }


    handleScrollContentSizeChange = (width, height) => {
        this.setState({ scrollHeight: height })
    }


    render() {
        const {
            dragging,
            dropWidth,
            taskDropped,
            dropY,
            scrollHeight,
            panelVisible
        } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    onScroll={this.handleScroll}
                    onContentSizeChange={this.handleScrollContentSizeChange}>
                    <TimeLine />
                    <TaskContainer
                        scrollHeight={scrollHeight}
                        dropY={dropY}
                        taskDropped={taskDropped} />
                </ScrollView>
                <AddItemPanel
                    visible={panelVisible}
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