import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { onDropWidth } from '../actions/DragAnimationActions'



class TaskContainer extends Component {

    onLayout = (event) => {
        let { width } = event.nativeEvent.layout;
        console.log(this.props)
        this.props.onDropWidth(width)
    }


    render() {
        return (
            <View onLayout={this.onLayout} style={styles.container}>

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
    }
}


function mapStateToProps(state) {
    return {
        drag: state.drag
    }
}


function mapDispatchToProps() {
    return bindActionCreators({
        onDropWidth,
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer);