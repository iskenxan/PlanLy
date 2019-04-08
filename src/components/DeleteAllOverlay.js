import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import {
  ACCENT_ORANGE,
  DARK_BLUE,
  MED_BLUE,
} from '../colors';


const SCREEN_WIDTH = Dimensions.get('window').width;


const DeleteAllOverlay = ({ isVisible, onDelete, onCancel }) => {
  const width = SCREEN_WIDTH * 0.93;
  return (
    <Overlay
      onBackdropPress={onCancel}
      isVisible={isVisible}
      width={width}
      height={200}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            color: DARK_BLUE,
            textAlign: 'center',
            fontSize: 18,
          }}>
                    Do you wish to clear all tasks?
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
          <Button
            title="Cancel"
            buttonStyle={{
              height: 35,
              width: 85,
              borderColor: MED_BLUE,
            }}
            titleStyle={{
              color: MED_BLUE,
            }}
            type="outline"
            onPress={onCancel} />
          <Button
            title="Clear"
            buttonStyle={{
              height: 35,
              width: 85,
              backgroundColor: ACCENT_ORANGE,
            }}
            onPress={onDelete} />
        </View>
      </View>
    </Overlay>
  );
};

export default DeleteAllOverlay;
