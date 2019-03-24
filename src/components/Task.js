import React, { Component } from 'react';
import {
  View, Text, Image, Animated,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DRAG_BTN } from '../media';
import { getDurationText } from '../utils/Formatter';
import { removeTask } from '../actions/TasksAction';
import EditTaskOverlay from './EditTaskOverlay';


class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isElevated: false,
      overlayVisible: false,
    };
  }


  componentWillReceiveProps(nextProps) {
    let isElevated = false;
    const { elevatedIndex } = nextProps.drag;
    const { data: { index } } = this.props;

    if (elevatedIndex === index) {
      isElevated = true;
    }
    this.setState({ isElevated });
  }


  onDelete = () => {
    const { data: { index }, removeTask: removeTaskAction } = this.props;
    removeTaskAction(index);
  }


  onEdit = () => {
    this.setState({ overlayVisible: true });
  }


  PopupMenu = ({ children }) => (
    <Menu>
      <MenuTrigger>
        {children}
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={this.onDelete}>
          <Text style={{ padding: 10 }}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={this.onEdit}>
          <Text style={{ padding: 10 }}>onEdit</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  )


  getElevatedCardStyle = (style) => {
    const { isElevated } = this.state;
    const newStyle = { ...style };
    if (isElevated) {
      newStyle.elevation = 5;
      newStyle.left = 10;
      newStyle.right = 10;
    } else {
      newStyle.elevation = 0;
      newStyle.left = 5;
      newStyle.right = 5;
    }

    return newStyle;
  }


  render() {
    const { overlayVisible } = this.state;
    const {
      data: {
        index,
        position,
        panResponder,
        startTime,
        title,
        duration,
        style,
      },
    } = this.props;

    const newStyle = this.getElevatedCardStyle(style);

    return (
      <Animated.View
        key={index}
        style={{ ...position.getLayout(), ...newStyle }}>
        <Image
          {...panResponder.panHandlers}
          source={DRAG_BTN}
          style={styles.cardDrag}
        />
        <View style={styles.cardTop}>
          <Text>{startTime}</Text>
          <this.PopupMenu>
            <Icon
              name="more-vert"
              color="#8493A8"
            />
          </this.PopupMenu>
        </View>
        <View style={styles.cardTitle}>
          <Text style={{ textAlign: 'center' }}>{title}</Text>
        </View>
        <Text style={styles.cardBottom}>{getDurationText(duration)}</Text>
        <EditTaskOverlay
          isVisible={overlayVisible} />
      </Animated.View>
    );
  }
}


const styles = {
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    height: 20,
    alignSelf: 'stretch',
  },
  cardTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottom: {
    alignSelf: 'stretch',
    textAlign: 'right',
  },
  cardDrag: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    padding: 10,
    width: 100,
    height: 22,
  },
};


function mapStateToProps(state) {
  return {
    drag: state.drag,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeTask,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Task);
