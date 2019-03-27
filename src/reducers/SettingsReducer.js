import {
  TOGGLE_SETTINGS,
} from '../actions/SettingsActions';


const initialState = {
  notifications: false,
  smartAdjustments: false,
};


const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SETTINGS: {
      const newState = { ...state };
      const { name, isOn } = action.payload;
      newState[name] = isOn;

      return newState;
    }
    default:
      return state;
  }
};

export default TaskReducer;
