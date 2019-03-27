import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { Overlay, Icon } from 'react-native-elements';
import {
  DARK_BLUE, MED_BLUE, ACCENT_ORANGE, LIGHT_GRAY,
} from '../colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SettingsOverlay({
  isVisible,
  onBackdropPress,
  toggleAdjustments,
  toggleNotifications,
  notificationsOn,
  adjustmentsOn,
}) {
  const width = SCREEN_WIDTH * 0.93;

  return (
    <Overlay
      onBackdropPress={onBackdropPress}
      isVisible={isVisible}
      width={width}
      height={210}>
      <View style={styles.root}>
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          color: DARK_BLUE,
        }}>
            Settings
        </Text>
        <View style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
        }}>
          <Text style={{
            color: MED_BLUE,
          }}>
            Smart Adjustments
          </Text>
          <Icon
            type="material"
            name="info"
            containerStyle={{
              marginRight: 'auto',
              marginLeft: 10,
            }}
            color={DARK_BLUE}
            size={20} />
          <ToggleSwitch
            isOn={adjustmentsOn}
            onColor={ACCENT_ORANGE}
            offColor={LIGHT_GRAY}
            size="medium"
            onToggle={toggleAdjustments} />
        </View>

        <View style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
        }}>
          <Text style={{
            color: MED_BLUE,
            marginRight: 'auto',
          }}>
            Notifications
          </Text>
          <ToggleSwitch
            isOn={notificationsOn}
            onColor={ACCENT_ORANGE}
            offColor={LIGHT_GRAY}
            size="medium"
            onToggle={toggleNotifications} />
        </View>

      </View>
    </Overlay>
  );
}


const styles = {
  root: {
    padding: 16,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
};
