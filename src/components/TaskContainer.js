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
            const { duration, title } = this.props;
            const height = calculateCardHeight(duration)
            this.addCard(height, title, duration);
        }
    }


    addCard = (height, title, duration) => {
        const newStack = [...this.state.cards];
        const card = (
            <View style={styles.card}>
                <Text>{title}</Text>
                <Text>{getDurationText(duration)}</Text>
            </View>
        )

        newStack.push(card);
        this.setState({ cards: newStack })
    }


    onLayout = (event) => {
        let { width } = event.nativeEvent.layout;
        console.log(this.props)
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
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 130,
        maxHeight: 180,
        alignItems: 'center',
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