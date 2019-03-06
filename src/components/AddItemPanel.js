import React, { Component } from 'react';
import { View, Image, Animated } from 'react-native';
import { ACCENT_GRADIENT } from '../media'
import { Text } from 'react-native-elements';
import AddItemCard from './AddItemCard';


class AddItemPanel extends Component {

    constructor(props) {
        super(props);
        
    }


    render() {

        return (
            <View style={styles.container}>
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
                            {...this.props} />
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

export default AddItemPanel;