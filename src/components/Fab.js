import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { FAB_BTN } from '../media';

class Fab extends Component {
    onFabPress = () => {
      const { onPressed } = this.props;
      onPressed();
    }

    render() {
      return (
        <TouchableOpacity
          style={{
            height: 72,
            width: 70,
            position: 'absolute',
            bottom: 15,
            right: 10,
          }}
          onPress={this.onFabPress}
        >
          <Image
            style={{
              height: 72,
              width: 70,
            }}
            source={FAB_BTN}
          />
        </TouchableOpacity>
      );
    }
}


export default Fab;
