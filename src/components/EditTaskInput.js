import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Input,
  Slider,
} from 'react-native-elements';
import { getDurationText } from '../utils/Formatter';
import { ACCENT_ORANGE } from '../colors';


const EditTaskInput = ({
  name,
  onNameChanged,
  duration,
  onDurationChanged,
}) => (
  <View style={{ flex: 1, width: '100%' }}>
    <View style={styles.centeredContent}>
      <Text>Title:</Text>
      <Input
        value={name}
        onChangeText={value => onNameChanged(value)}
        containerStyle={{ flex: 1, padding: 1 }}
        inputStyle={styles.input} />
    </View>
    <Text style={{ marginTop: 15, alignSelf: 'center' }}>{getDurationText(duration)}</Text>
    <View style={styles.centeredContent}>
      <Text style={{ marginRight: 10 }}>Duration:</Text>
      <Slider
        thumbTintColor={ACCENT_ORANGE}
        step={5}
        maximumValue={480}
        minimumValue={15}
        value={duration}
        onValueChange={value => onDurationChanged(value)}
        style={styles.slider} />
    </View>
  </View>
);


const styles = {
  input: {
    fontSize: 14,
    maxHeight: 12,
    padding: 1,
  },
  slider: {
    flex: 1,
    width: null,
    marginRight: 8,
    padding: 1,
  },
  centeredContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};

export default EditTaskInput;
