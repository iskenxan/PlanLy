import React, { Component } from 'react';
import { connect } from 'redux';
import { View, ScrollView, PanResponder, Animated } from 'react-native';
import TimeLine from './Timeline';
import AddItemPanel from './AddItemPanel';


class Root extends Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY();

        this.state = {
            dropWidth: 0,
            dragging: false,
        }

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const { dragging } = this.state;
                if (!dragging) {
                    this.setState({ dragging: true });
                }
                this.position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (e, gesture) => {
                this.setState({ dragging: false })
            }
        });
    }


    render() {
        const { dragging, dropWidth } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <TimeLine />
                    <View style={}
                        onLayout={this.onLayout}>

                    </View>
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