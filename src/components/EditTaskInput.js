import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Input,
  Slider,
  Icon,
} from 'react-native-elements';
import { getDurationText } from '../utils/Formatter';
import {
  ACCENT_ORANGE,
  DARK_BLUE,
  LIGHT_BLUE,
  MED_BLUE,
} from '../colors';


const getNameInput = (name, onNameChanged) => {
  if (name) {
    return (
      <Input
        value={name}
        rightIcon={(
          <Icon
            onPress={() => onNameChanged('')}
            size={15}
            type="material"
            name="clear"
            color={MED_BLUE}
       />
      )}
        onChangeText={value => onNameChanged(value)}
        containerStyle={{ flex: 1, padding: 1 }}
        inputStyle={styles.input} />
    );
  }
  return (
    <Input
      value={name}
      onChangeText={value => onNameChanged(value)}
      containerStyle={{ flex: 1, padding: 1 }}
      inputStyle={styles.input} />
  );
};


const EditTaskInput = ({
  name,
  onNameChanged,
  duration,
  onDurationChanged,
}) => (
  <View style={{ flex: 1, width: '100%' }}>
    <View style={styles.centeredContent}>
      <Text style={{ color: DARK_BLUE }}>Title:</Text>
      {getNameInput(name, onNameChanged)}
    </View>
    <Text style={{ color: DARK_BLUE, marginTop: 15, alignSelf: 'center' }}>{getDurationText(duration)}</Text>
    <View style={styles.centeredContent}>
      <Text style={{ marginRight: 10, color: DARK_BLUE }}>Duration:</Text>
      <Slider
        thumbTintColor={ACCENT_ORANGE}
        step={5}
        minimumTrackTintColor={DARK_BLUE}
        maximumTrackTintColor={LIGHT_BLUE}
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
    color: DARK_BLUE,
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
