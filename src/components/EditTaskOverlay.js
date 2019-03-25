import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import EditTaskInput from './EditTaskInput';
import { ACCENT_ORANGE } from '../colors';


const SCREEN_WIDTH = Dimensions.get('window').width;

export class EditTaskOverlay extends Component {
  constructor(props) {
    super(props);
    const { title, duration } = props;
    this.state = {
      duration,
      title: title || '',
    };
  }


  onDurationChanged = (value) => {
    this.setState({ duration: value });
  }


  onTextChanged = (value) => {
    this.setState({ title: value });
  }


  onSavePress = () => {
    const { title, duration } = this.state;
    const { onSavePress } = this.props;

    onSavePress(title, duration);
  }


  render() {
    const { isVisible, onBackdropPress } = this.props;
    const { title, duration } = this.state;
    const width = SCREEN_WIDTH * 0.93;
    return (
      <Overlay
        onBackdropPress={onBackdropPress}
        containerStyle={styles.overlayContainer}
        isVisible={isVisible}
        width={width}
        height={210}>
        <View style={styles.root}>
          <EditTaskInput
            duration={duration}
            name={title}
            onDurationChanged={this.onDurationChanged}
            onNameChanged={this.onTextChanged} />
          <Button
            onPress={this.onSavePress}
            buttonStyle={styles.saveButton}
            type="solid"
            title="Save" />
        </View>
      </Overlay>
    );
  }
}


const styles = {
  overlayContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  root: {
    flex: 1,
  },
  saveButton: {
    marginTop: 10,
    maxWidth: 100,
    minWidth: 100,
    borderRadius: 10,
    backgroundColor: ACCENT_ORANGE,
    alignSelf: 'center',
  },
};

export default EditTaskOverlay;
