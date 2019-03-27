import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { ActionSheet } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentDay } from '../actions/TasksAction';
import { toggleSettings } from '../actions/SettingsActions';
import { DARK_BLUE } from '../colors';
import SettingsOverlay from './SettingsOverlay';


const SHEET = [
  { text: 'Monday', icon: 'briefcase', iconColor: '#2196f3' },
  { text: 'Tuesday', icon: 'briefcase', iconColor: '#2196f3' },
  { text: 'Wednesday', icon: 'briefcase', iconColor: '#2196f3' },
  { text: 'Thursday', icon: 'briefcase', iconColor: '#2196f3' },
  { text: 'Friday', icon: 'briefcase', iconColor: '#2196f3' },
  { text: 'Saturday', icon: 'ice-cream', iconColor: '#ff9800' },
  { text: 'Sunday', icon: 'ice-cream', iconColor: '#ff9800' },
];

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsOverlayVisible: false,
    };
  }

  onPressed = () => {
    ActionSheet.show({
      options: SHEET,
      title: 'Select week day',
      cancelButtonIndex: 7,
    },
    (index) => {
      if (index === 7) return;
      const { setCurrentDay: setCurrentDayAction } = this.props;
      const newDay = SHEET[index].text;
      setCurrentDayAction(newDay);
    });
  }


  toggleSettingsVisibility = (isVisible) => {
    this.setState({ settingsOverlayVisible: isVisible });
  }


  toggleSmartAdjustments = (isOn) => {
    const { toggleSettings: toggleSettingsAction } = this.props;
    toggleSettingsAction('smartAdjustments', isOn);
  }


  toggleNotifications = (isOn) => {
    const { toggleSettings: toggleSettingsAction } = this.props;
    toggleSettingsAction('notifications', isOn);
  }


  render() {
    const { arrowDownIcon, dropDownAction, settingsIcon } = styles;
    const {
      currentDay,
      settings: { smartAdjustments, notifications },
    } = this.props;
    const { settingsOverlayVisible } = this.state;
    return (
      <View style={{
        minHeight: 60,
        maxHeight: 60,
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 10,
        margin: 10,
      }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={dropDownAction}
            onPress={this.onPressed}>
            <Text
              style={{
                color: DARK_BLUE,
                fontSize: 22,
              }}>
              {currentDay}
            </Text>
            <Icon
              type="material"
              name="expand-more"
              color={DARK_BLUE}
              style={arrowDownIcon} />
          </TouchableOpacity>
          <Icon
            onPress={() => this.toggleSettingsVisibility(true)}
            type="ionicon"
            name="ios-settings"
            containerStyle={settingsIcon}
            color={DARK_BLUE} />
        </View>
        <SettingsOverlay
          notificationsOn={notifications}
          adjustmentsOn={smartAdjustments} 
          toggleNotifications={this.toggleNotifications}
          toggleAdjustments={this.toggleSmartAdjustments}
          onBackdropPress={() => this.toggleSettingsVisibility(false)}
          isVisible={settingsOverlayVisible} />
      </View>
    );
  }
}


const styles = {
  dropDownAction: {
    width: 120,
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  arrowDownIcon: {
    width: 10,
    height: 10,
  },
  settingsIcon: {
    width: 50,
    padding: 10,
    position: 'absolute',
    right: 5,
    top: 8,
    height: 50,
  },
};


const mapStateToProps = state => ({
  currentDay: state.taskData.currentDay,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentDay,
  toggleSettings,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Header);
