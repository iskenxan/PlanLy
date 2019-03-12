import React, { Component } from 'react';
import { View, Text, Image, Animated, PanResponder } from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment';
import { onDropWidth } from '../actions/DragAnimationActions'
import { calculateCardHeight, getDurationText } from '../utils/Formatter'
import { DRAG_BTN } from '../media'


class TaskContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: {},
        }
    }


    componentWillReceiveProps(props) {
        if (props.taskDropped) {
            const { duration, title } = this.props.drag;
            const { scrollHeight } = this.props;
            const height = calculateCardHeight(duration)
            this.addCard(height, title, duration, props.dropY, scrollHeight);
        }
    }


    calculateStartTime = (y, scrollHeight) => {
        const unit = 86400 / scrollHeight;
        const seconds = y * unit;
        let current = moment().startOf('day');
        current.add(seconds, 's')
        let minutes = current.get('minutes');
        minutes = Math.ceil((minutes) / 5) * 5;
        current.set('minutes', minutes);

        const text = current.format('h:mm a');

        return text;
    }


    renderCard = (dropY, position, style, panResponder, startTime, title, duration) => {
        const containerStyle = {
            position: 'absolute',
            alignItems: 'center',
            left: 5,
            right: 5,
        }
        return (
            <Animated.View
                key={dropY}
                style={{ ...position.getLayout(), ...containerStyle }}>
                <View style={style}>
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
                </View>
            </Animated.View>
        );
    }


    addCard = (height, title, duration, dropY, scrollHeight) => {
        let newStack = { ...this.state.cards };
        const cardStyle = { ...styles.card };
        cardStyle.height = height;
        const deduction = height > 180 ? 150 : height;
        const y = dropY - deduction;
        let startTime = this.calculateStartTime(y, scrollHeight);

        cardStyle.top = y
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderGrant: (event, gesture) => {
                position.setOffset({ x: position.x._value, y: position.y._value });
                position.setValue({ x: 0, y: 0 })
            },
            onPanResponderRelease: (e, gesture) => {
                position.flattenOffset();
                const newY = y + gesture.dy;
                startTime = this.calculateStartTime(newY, scrollHeight);
                newStack = { ...this.state.cards };
                delete newStack.y;
                newStack[newY] = this.renderCard(newY, position, cardStyle,
                    panResponder, startTime, title, duration)
                this.setState({ cards: newStack })
            }
        });

        const card = this.renderCard(y, position,
            cardStyle, panResponder, startTime, title, duration);

        newStack[y] = card;
        console.log(newStack)
        this.setState({ cards: newStack })
    }


    onLayout = (event) => {
        let { width } = event.nativeEvent.layout;
        this.props.onDropWidth(width)
    }


    render() {
        return (
            <View onLayout={this.onLayout} style={styles.container}>
                {Object.values(this.state.cards)}
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
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        left: 0,
        right: 0,
        flex: 1,
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
        drag: state.drag
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        onDropWidth,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer);