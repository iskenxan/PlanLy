import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
            const height = calculateCardHeight(duration)
            this.addCard(height, title, duration, props.dropY);
        }
    }


    addCard = (height, title, duration, dropY) => {
        const newStack = [...this.state.cards];
        const cardStyle = { ...styles.card };
        cardStyle.height = height;
        const substitute = height > 180 ? 150 : height - 10
        const y = dropY - substitute;
        cardStyle.top = y
        console.log('TaskContainer:' + y)
        const card = (
            <View key={dropY} style={cardStyle}>
                <Text>{title}</Text>
                <Text>{getDurationText(duration)}</Text>
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
    },
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