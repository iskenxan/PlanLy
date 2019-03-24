import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { ActionSheet } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentDay } from '../actions/TasksAction';
import { DARK_BLUE } from '../colors';


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


  render() {
    const { arrowDownIcon, dropDownAction } = styles;
    const { currentDay } = this.props;
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
            justifyContent: 'center',
            flex: 1,
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
        </View>
      </View>
    );
  }
}


const styles = {
  dropDownAction: {
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  arrowDownIcon: {
    width: 10,
    height: 10,
  },
};


const mapStateToProps = state => ({
  currentDay: state.taskData.currentDay,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentDay,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Header);
