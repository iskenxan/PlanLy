import React, { Component } from 'react';
import { View, Text, Image, Animated, PanResponder } from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment';
import { addTask } from '../actions/TasksAction';
import { onDropWidth } from '../actions/DragAnimationActions'
import { calculateCardHeight, getDurationText, SECONDS_DAY } from '../utils/Formatter'
import { DRAG_BTN } from '../media'


class TaskContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elevatedTask: null,
            elevatedStartY: 0,
            elevatedIndex: -1,
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
        const { elevatedTask, elevatedStartY, elevatedIndex } = this.state;
        const currentY = elevatedStartY;
        const newStack = { ...this.state.tasks };

        const newY = currentY + gestureY;
        const startTime = this.calculateStartTime(newY);
        const newTask = { ...elevatedTask, startTime };
        newStack[elevatedIndex] = newTask;
        this.setState({ tasks: newStack, elevatedTask: null })
    }


    createPanResponder = (index) => {
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const { elevatedTask: { position } } = this.state;
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderGrant: (event, gesture) => {
                const task = this.props.tasks[index];
                const { position } = task;
                const currentY = position.y._value;
                position.setOffset({ x: position.x._value, y: currentY });
                position.setValue({ x: 0, y: 0 })
                this.setState({ elevatedTask: task, elevatedIndex: index, elevatedStartY: currentY })
            },
            onPanResponderRelease: (e, gesture) => {
                const { position } = this.state.elevatedTask
                const moveY = Math.abs(gesture.dy);
                position.flattenOffset();

                if (moveY <= 5) {
                    return this.setState({ elevatedTask: null });
                }
                this.rerenderNewCardAndUpdateStack(gesture.dy);
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
        this.setState({ elevatedTask: null })
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


    renderCard = ({ index, style, position, panResponder, startTime, title, duration }) => {
        return (
            <Animated.View
                key={index}
                style={{ ...position.getLayout(), ...style }}>
                <Image
                    {...panResponder.panHandlers}
                    source={DRAG_BTN}
                    style={styles.cardDrag} />
                <View style={styles.cardTop}>
                    <Text>{startTime}</Text>
                    <Icon
                        name='more-vert'
                        color='#8493A8' />
                </View>
                <View style={styles.cardTitle}>
                    <Text style={{ textAlign: 'center' }}>{title}</Text>
                </View>
                <Text style={styles.cardBottom}>{getDurationText(duration)}</Text>
            </Animated.View>
        );
    }


    renderStack = () => {
        const { elevatedTask } = this.state;
        const { tasks } = this.props;
        const cards = Object.values(tasks).map(task => {
            const { style } = task;
            const newStyle = { ...style };
            if (elevatedTask && elevatedTask.startTime === task.startTime) {
                newStyle.elevation = 5;
                newStyle.left = 10;
                newStyle.right = 10;
            } else {
                newStyle.elevation = 0;
                newStyle.left = 5;
                newStyle.right = 5;
            }

            task.style = newStyle;

            const card = this.renderCard(task);
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
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        height: 20,
        alignSelf: 'stretch'
    },
    cardTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardBottom: {
        alignSelf: 'stretch',
        textAlign: 'right'
    },
    cardDrag: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0,
        width: 75,
        height: 17,
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
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer);