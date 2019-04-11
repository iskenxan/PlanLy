import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  View, Image,
  Animated,
  Dimensions,
  PanResponder,
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
    this.state = {
      dragging: false,
    };

    this.widthValue = new Animated.Value(0);
    this.heightValue = new Animated.Value(0);
    this.position = new Animated.ValueXY();

    this.setupPanResponder();
  }


  setupPanResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.setState({ dragging: true });
        this.position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderGrant: () => {
        const { onTaskDragStarted } = this.props;
        onTaskDragStarted();
      },
      onPanResponderRelease: (e, gesture) => {
        const { onTaskDropped } = this.props;
        this.position.flattenOffset();
        if (gesture.dy < -150) {
          onTaskDropped(gesture.dy);
          this.togglePanel(false);
        }
        this.setState({ dragging: false });
        this.position.setValue({ x: 0, y: 0 });
      },
    });
  }


  onDragStarted = (title, duration) => {
    const { onTaskDataReceived: onTaskReceivedAction } = this.props;
    onTaskReceivedAction(title, duration);
  }


  togglePanel = (isOpen) => {
    const width = isOpen ? SCREEN_WIDTH : 0;
    const height = isOpen ? 230 : 0;

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
    ]).start();
  }


  renderPanel = () => {
    const { dragging } = this.state;
    const containerStyle = styles.container;
    containerStyle.width = this.widthValue;
    containerStyle.height = this.heightValue;

    return (
      <Animated.View style={containerStyle}>
        <Image
          style={styles.backgroundImage}
          source={ACCENT_GRADIENT} />
        <View style={styles.innerContainer}>
          <Text
            style={styles.title}>
            Fill out the card and drag it over when ready
          </Text>
          <Animated.View
            style={this.position.getLayout()}
            {...this.panResponder.panHandlers}>
            <AddItemCard
              dragging={dragging}
              {...this.props}
              onDragStarted={this.onDragStarted} />
          </Animated.View>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 10,
            right: 5,
          }}>
          <Icon
            onPress={() => this.togglePanel(false)}
            reverse
            reverseColor={DARK_BLUE}
            name="close"
            size={10}
            type="material"
            color="#fff" />
        </View>

      </Animated.View>
    );
  }


  onFabPressed = () => {
    this.togglePanel(true);
  }


  render() {
    return (
      <View style={{
        backgroundColor: 'trasnparent',
      }}>
        <Fab
          onPressed={this.onFabPressed} />
        {this.renderPanel()}
      </View>
    );
  }
}


const styles = {
  container: {
    width: 0,
    height: 0,
    backgroundColor: 'trasnparent',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: 'trasnparent',
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
