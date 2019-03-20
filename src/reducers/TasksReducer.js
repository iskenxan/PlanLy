import { ADD_TASK, REMOVE_TASK, UPDATE_TASK } from '../actions/TasksAction'

const initialState = {
    tasks: {},
    currentIndex: 0,
}


const TaskReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TASK: {
            const task = action.payload;
            const newTasks = { ...state.tasks };
            newTasks[state.currentIndex] = task;

            return { tasks: newTasks, currentIndex: state.currentIndex + 1 };
        }
        case REMOVE_TASK: {
            const index = action.payload;
            const newTasks = { ...state.tasks };
            delete newTasks[index];

            return { tasks: newTasks, currentIndex: state.currentIndex - 1 };
        }
        case UPDATE_TASK: {
            const task = action.payload;
            const { index } = task;
            const newTasks = { ...state.tasks };
            newTasks[index] = task;

            return { tasks: newTasks, currentIndex: state.currentIndex };
        }
    }

    return state;
}

export default TaskReducer;