import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, PanResponder, Animated } from 'react-native';
import TimeLine from './Timeline';
import AddItemPanel from './AddItemPanel';
import TaskContainer from './TaskContainer'



class Root extends Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY();

        this.state = {
            dropWidth: 0,
            dragging: false,
            taskDropped: false,
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
                if (gesture.dy < -210) {
                    this.setState({ dragging: false, taskDropped: true })
                } else {
                    this.position.setValue({ x: 0, y: 0 });
                    this.setState({ dragging: false })
                }
            }
        });
    }


    render() {
        const { dragging, dropWidth, taskDropped } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <TimeLine />
                    <TaskContainer
                         taskDropped={taskDropped}/>
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