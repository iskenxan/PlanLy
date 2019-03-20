import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment';
import { addTask, updateTask } from '../actions/TasksAction';
import { onDropWidth, setElevatedIndex } from '../actions/DragAnimationActions'
import { calculateCardHeight, SECONDS_DAY } from '../utils/Formatter'
import Task from './Task';



class TaskContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elevatedTask: null,
            elevatedStartY: 0,
        }
    }


    componentWillReceiveProps(props) {
        if (props.taskDropped && !this.props.taskDropped) {
            const { scrollHeight } = props;
            const { duration, title } = this.props.drag;
            const height = calculateCardHeight(duration, scrollHeight)
            this.addCard(height, title, duration, props.dropY);
        }
    }


    calculateStartTime = (y) => {
        const { scrollHeight } = this.props;
        let unit = Math.fround(SECONDS_DAY / scrollHeight);
        let seconds = y * unit;

        let current = moment().startOf('day');
        current.add(seconds, 'S')
        let minutes = current.get('minutes');
        minutes = Math.floor(minutes / 5) * 5;
        current.set('minutes', minutes);

        const text = current.format('h:mm a');

        return text;
    }


    rerenderNewCardAndUpdateStack = (gestureY) => {
        const { elevatedStartY } = this.state;
        const { elevatedIndex } = this.props.drag;
        const elevatedTask = this.props.tasks[elevatedIndex];
        const currentY = elevatedStartY;

        const newY = currentY + gestureY;

        const startTime = this.calculateStartTime(newY);

        const newTask = { ...elevatedTask, startTime };
        this.props.updateTask(newTask);
        this.props.setElevatedIndex(-1);
    }


    handleResponderRelease(gesture) {
        const { elevatedIndex } = this.props.drag;
        const { position } = this.props.tasks[elevatedIndex];
        const moveY = Math.abs(gesture.dy);
        position.flattenOffset();
 
        if (moveY <= 5) {
            return this.props.setElevatedIndex(-1);
        }
        this.rerenderNewCardAndUpdateStack(gesture.dy);
    }


    createPanResponder = (index) => {
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderMove: (event, gesture) => {
                const { elevatedIndex } = this.props.drag;
                const { position } = this.props.tasks[elevatedIndex];
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderGrant: (event, gesture) => {
                const task = this.props.tasks[index];
                const { position } = task;
                const currentY = position.y._value;

                position.setOffset({ x: position.x._value, y: currentY });
                position.setValue({ x: 0, y: 0 })
                this.props.setElevatedIndex(task.index);
                this.setState({ elevatedStartY: currentY })
            },
            onPanResponderRelease: (e, gesture) => {
                this.handleResponderRelease(gesture);
            },
            onPanResponderTerminate: (e, gesture) => {
                this.handleResponderRelease(gesture);
            }
        });

        return panResponder;
    }


    createNewCardAndAddToStack = (y, cardStyle, title, duration, startTime) => {
        const { currentIndex: index } = this.props;
        const position = new Animated.ValueXY()
        position.setValue({ x: 0, y })
        const panResponder = this.createPanResponder(index);
        const task = { index, title, duration, startTime, position, panResponder, style: cardStyle };
        this.props.addTask(task)
    }


    addCard = (height, title, duration, dropY) => {
        const cardStyle = { ...styles.card };
        cardStyle.height = height;
        let startTime = this.calculateStartTime(dropY);

        this.createNewCardAndAddToStack(dropY, cardStyle, title, duration, startTime);
    }


    onLayout = (event) => {
        let { width } = event.nativeEvent.layout;
        this.props.onDropWidth(width)
    }


    renderStack = () => {
        const { tasks } = this.props;
        const cards = Object.values(tasks).map(task => {
            const card = (<Task key={task.index} data={task} />)
            return card;
        })

        return cards;
    }


    render() {
        return (
            <View onLayout={this.onLayout} style={styles.container}>
                {this.renderStack()}
            </View>
        )
    }
}


const styles = {
    container: {
        flex: 1,
        width: null,
        height: null,
    },
    card: {
        position: 'absolute',
        alignItems: 'center',
        left: 5,
        right: 5,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
    }
}


function mapStateToProps(state) {
    return {
        drag: state.drag,
        tasks: state.taskData.tasks,
        currentIndex: state.taskData.currentIndex,
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        onDropWidth,
        addTask,
        updateTask,
        setElevatedIndex
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer);