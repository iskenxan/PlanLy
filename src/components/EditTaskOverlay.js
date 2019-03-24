import React, { Component } from 'react';
import { Overlay } from 'react-native-elements';
import EditTaskInput from './EditTaskInput';


export class EditTaskOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      title: 0,
    };
  }


  onDurationChanged = (value) => {
    this.setState({ duration: value });
  }


  onTextChanged = (value) => {
    this.setState({ title: value });
  }


  render() {
    const { isVisible } = this.props;
    const { title, duration } = this.state;
    return (
      <Overlay
        isVisible={isVisible}
        width="auto"
        height="auto">
        <EditTaskInput
          duration={duration}
          name={title}
          onDurationChanged={this.onDurationChanged}
          onNameChanged={this.onTextChanged} />
      </Overlay>
    );
  }
}

export default EditTaskOverlay;
