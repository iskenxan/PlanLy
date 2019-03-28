import React from 'react';
import { View, Text } from 'react-native';
import { calculateDuration, getDurationText } from '../utils/Formatter';


const Break = ({
  height,
  scrollHeight,
  startY,
}) => {
  const duration = calculateDuration(height, scrollHeight);
  const containerStyle = { ...styles.container };
  containerStyle.top = startY;
  containerStyle.height = height;

  return (
    <View
      style={containerStyle}>
      <Text
        style={styles.text}>
        {getDurationText(duration)}
      </Text>
    </View>
  );
};


const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    width: '100%',
  },
};


export default Break;
