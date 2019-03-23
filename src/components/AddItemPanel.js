import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  View, Image, Animated, Dimensions,
} from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { ACCENT_GRADIENT } from '../media';
import AddItemCard from './AddItemCard';
import { onTaskDataReceived } from '../actions/DragAnimationActions';
import Fab from './Fab';
import { DARK_BLUE } from '../colors';


const SCREEN_WIDTH = Dimensions.get('window').width;


class AddItemPanel extends Component {
  constructor(props) {
    super(props);
    this.widthValue = new Animated.Value(0);
    this.heightValue = new Animated.Value(0);
    this.fabWidth = new Animated.Value(SCREEN_WIDTH);
  }


    onDragStarted = (title, duration) => {
      const { onTaskDataReceived: onTaskReceivedAction } = this.props;
      onTaskReceivedAction(title, duration);
    }


    togglePanel = (isOpen) => {
      const width = isOpen ? SCREEN_WIDTH : 0;
      const height = isOpen ? 230 : 0;
      const fabOpacity = isOpen ? 0 : SCREEN_WIDTH;

      Animated.parallel([
        Animated.timing(
          this.widthValue, {
            toValue: width,
            duration: 200,
          },
        ),
        Animated.timing(
          this.heightValue, {
            toValue: height,
            duration: 200,
          },
        ),
        Animated.timing(
          this.fabWidth, {
            toValue: fabOpacity,
            duration: 200,
          },
        ),
      ]).start();
    }


    renderPanel = () => {
      const {
        panHandlers,
        layoutStyle,
      } = this.props;
      const containerStyle = styles.container;
      containerStyle.width = this.widthValue;
      containerStyle.height = this.heightValue;

      return (
        <Animated.View style={containerStyle}>
          <Image
            style={styles.backgroundImage}
            source={ACCENT_GRADIENT}
          />
          <View style={styles.innerContainer}>
            <Text
              style={styles.title}
            >
                        Fill out the card and drag it over when ready
            </Text>
            <Animated.View
              style={layoutStyle}
              {...panHandlers}
            >
              <AddItemCard
                {...this.props}
                onDragStarted={this.onDragStarted}
              />
            </Animated.View>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 5,
            }}
          >
            <Icon
              onPress={() => this.togglePanel(false)}
              reverse
              reverseColor={DARK_BLUE}
              name="close"
              size={10}
              type="material"
              color="#fff"
            />
          </View>

        </Animated.View>
      );
    }


    onFabPressed = () => {
      this.togglePanel(true);
    }


    render() {
      return (
        <View>
          {this.renderPanel()}
          <Animated.View
            style={{
              width: this.fabWidth,
            }}
          >
            <Fab
              onPressed={this.onFabPressed}
            />
          </Animated.View>
        </View>
      );
    }
}


const styles = {
  container: {
    width: 0,
    height: 0,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  title: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    alignSelf: 'center',
  },
};


function mapStateToProps(state) {
  return {
    drag: state.drag,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onTaskDataReceived,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemPanel);
