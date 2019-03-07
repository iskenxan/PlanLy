import { combineReducers } from 'redux';
import DragAnimationReducer from './DragAnimationReducer'


export default combineReducers({
    drag: DragAnimationReducer,
})