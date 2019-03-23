import { combineReducers } from 'redux';
import DragAnimationReducer from './DragAnimationReducer';
import TasksReducer from './TasksReducer';


export default combineReducers({
  drag: DragAnimationReducer,
  taskData: TasksReducer,
});
