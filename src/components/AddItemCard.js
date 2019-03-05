import React from 'react';
import { Text, Input, Slider } from 'react-native-elements';
import { View } from 'react-native';


const getDurationText = (duration) => {
    duration = Math.floor(duration);

    if (duration < 60) {
        return `${duration} mins`
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
        return `${hours} hr`;
    }
    
    return `${hours} hr, ${minutes} mins`;
}


const AddItemCard = ({ duration, onDurationChanged }) => (
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
            <Text style={{ marginRight: 10 }}>Duration:</Text>
            <Slider
                thumbTintColor='#F5A623'
                step={5}
                maximumValue={300}
                minimumValue={0}
                value={duration}
                onValueChange={onDurationChanged}
                style={{
                    flex: 1,
                    width: null,
                }}
            />
        </View>
        <Text>{getDurationText(duration)}</Text>
    </View>
)


const styles = {
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


export default AddItemCard;