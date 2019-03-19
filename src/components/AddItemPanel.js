import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Image, Animated } from 'react-native';
import { ACCENT_GRADIENT } from '../media'
import { Text } from 'react-native-elements';
import AddItemCard from './AddItemCard';
import { onTaskDataReceived } from '../actions/DragAnimationActions'



class AddItemPanel extends Component {

    constructor(props) {
        super(props);
    }


    onDragStarted = (title, duration) => {
        this.props.onTaskDataReceived(title, duration)
    }

    handleOnLayout = (event) => {
        const { y } = event.nativeEvent.layout;
        this.props.onCardlayout(y + 55);
    }


    render() {

        return (
            <View style={styles.container}
                onLayout={this.handleOnLayout}>
                <Image
                    style={styles.backgroundImage}
                    source={ACCENT_GRADIENT}
                />
                <View style={styles.innerContainer}>
                    <Text
                        style={styles.title}>
                        Fill out the card and drag it over when ready
                    </Text>
                    <Animated.View
                        style={this.props.layoutStyle}
                        {...this.props.panHandlers}>
                        <AddItemCard
                            {...this.props}
                            onDragStarted={this.onDragStarted} />
                    </Animated.View>
                </View>
            </View>
        )
    }
}


const styles = {
    container: {
        width: '100%',
        height: 210,
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        width: '100%',
        paddingTop: 25,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between'
    },
    backgroundImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
        alignSelf: 'center'
    }
}


function mapStateToProps(state) {
    return {
        drag: state.drag,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        onTaskDataReceived,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemPanel);