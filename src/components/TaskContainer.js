import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment';
import { onDropWidth } from '../actions/DragAnimationActions'
import { calculateCardHeight, getDurationText } from '../utils/Formatter'



class TaskContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
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
        console.log('calculatedTime:' + text);

        return text;
    }


    addCard = (height, title, duration, dropY, scrollHeight) => {
        const newStack = [...this.state.cards];
        const cardStyle = { ...styles.card };
        cardStyle.height = height;
        const deduction = height > 180 ? 150 : height;
        const y = dropY - deduction;
        cardStyle.top = y
        const startTime = this.calculateStartTime(y, scrollHeight);
        const card = (
            <View key={dropY} style={cardStyle}>
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
        )

        newStack.push(card);
        this.setState({ cards: newStack })
    }


    onLayout = (event) => {
        let { width } = event.nativeEvent.layout;
        this.props.onDropWidth(width)
    }


    render() {
        return (
            <View onLayout={this.onLayout} style={styles.container}>
                {this.state.cards}
            </View>
        )
    }
}


const styles = {
    container: {
        flex: 1,
        width: null,
        height: null,
        backgroundColor: '#A5B3BC'
    },
    card: {
        position: 'absolute',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        left: 5,
        right: 5,
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