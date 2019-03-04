import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { ACCENT_GRADIENT } from '../media'
import { Text, Input, Slider } from 'react-native-elements';



class AddItemPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            duration: 0,
        }
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
                    <View style={styles.card}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            <Text>Title:</Text>
                            <Input
                                containerStyle={{ flex: 1, width: null }}
                                inputStyle={styles.input}
                                placeholder='Your task title'
                            />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            <Text>Duration:</Text>
                            <Slider
                                style={{
                                    flex:1,
                                }}
                                // value={this.state.value}
                                // onValueChange={value => this.setState({ value })}
                            />
                        </View>
                    </View>
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
    },
    card: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 130,
        maxHeight: 130,
        alignItems: 'center',
    },
    input: {
        fontSize: 14,
    }
}

export default AddItemPanel;