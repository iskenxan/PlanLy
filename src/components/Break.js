import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import { getDurationText, calculateStartTime } from '../utils/Formatter';
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

const getTaskTimes = (tasks) => {
  const taskTimes = Object.values(tasks).map((task) => {
    const {
      y,
      style: { height },
      duration,
    } = task;
    return {
      y,
      height,
      duration,
    };
  });

  taskTimes.sort((a, b) => a.y - b.y);

  return taskTimes;
};


const renderBreaks = (tasks, scrollHeight) => {
  const breaks = [];
  const taskTimes = getTaskTimes(tasks);

  for (let i = 0; i < taskTimes.length - 1; i += 1) {
    const {
      y: firstTaskY,
      height: startHeight,
      duration,
    } = taskTimes[i];
    const firstTaskStart = calculateStartTime(firstTaskY, scrollHeight);

    const { y: nextTaskY } = taskTimes[i + 1];
    const breakY = firstTaskY + startHeight;
    const height = nextTaskY - breakY;
    const nextTaskStart = calculateStartTime(nextTaskY, scrollHeight);

    const startMoment = moment(firstTaskStart, ['h:mm A']);
    startMoment.add(duration, 'm');
    const endMoment = moment(nextTaskStart, ['h:mm A']);

    const breakDuration = endMoment.diff(startMoment, 'm');
    if (breakDuration >= 5) {
      breaks.push(
        <Break
          duration={breakDuration}
          key={`b${i}`}
          height={height}
          startY={breakY} />,
      );
    }
  }

  return breaks;
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


module.exports = {
  renderBreaks,
};
