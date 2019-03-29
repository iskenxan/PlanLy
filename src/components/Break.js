import React from 'react';
import { View, Text } from 'react-native';
import { getDurationText } from '../utils/Formatter';
import { LIGHT_BLUE, PALE_BLUE } from '../colors';


const Break = ({
  height,
  duration,
  startY,
}) => {
  const containerStyle = { ...styles.container };
  containerStyle.top = startY;
  containerStyle.height = height;

  return (
    <View
      style={containerStyle}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
      }}>
        <View style={styles.separatorContainer} />
      </View>
      <Text
        style={styles.text}>
        {getDurationText(duration)}
      </Text>
      <View style={{
        flex: 1,
      }}>
        <View style={styles.separatorContainer} />
      </View>
    </View>
  );
};


const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  text: {
    textAlign: 'center',
    width: '100%',
    color: LIGHT_BLUE,
    fontSize: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  separatorContainer: {
    width: 2,
    height: '100%',
    backgroundColor: PALE_BLUE,
  },
};


export default Break;
