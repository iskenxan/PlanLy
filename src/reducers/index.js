import { combineReducers } from 'redux';
import DragAnimationReducer from './DragAnimationReducer';
import TasksReducer from './TasksReducer';
import SettingsReducer from './SettingsReducer';


export default combineReducers({
  drag: DragAnimationReducer,
  taskData: TasksReducer,
  settings: SettingsReducer,
});
