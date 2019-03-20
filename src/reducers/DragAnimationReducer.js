import { TASK_DATA_RECEIVED, DROP_WIDTH_RECEIVED, SET_ELEVATED_TASK } from '../actions/DragAnimationActions'

const initialState = {
    title: '',
    duration: 0,
    dropWidth: 0,
    elevatedIndex: -1,
}


const DragAnimationReducer = (state = initialState, action) => {
    switch (action.type) {
        case TASK_DATA_RECEIVED:
            const { title, duration } = action.payload;
            return { ...state, title, duration }
        case DROP_WIDTH_RECEIVED:
            return { ...state, dropWidth: action.payload }
        case SET_ELEVATED_TASK:
            return { ...state, elevatedIndex: action.payload }
    }

    return state;
}

export default DragAnimationReducer;