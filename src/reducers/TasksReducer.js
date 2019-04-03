import _ from 'lodash';

import {
  ADD_TASK, REMOVE_TASK, UPDATE_TASK, SET_CURRENT_DAY,
} from '../actions/TasksAction';

const initialState = {
  weekPlan: {
    Monday: {
      tasks: {},
      currentIndex: 0,
    },
    Tuesday: {
      tasks: {},
      currentIndex: 0,
    },
    Wednesday: {
      tasks: {},
      currentIndex: 0,
    },
    Thursday: {
      tasks: {},
      currentIndex: 0,
    },
    Friday: {
      tasks: {},
      currentIndex: 0,
    },
    Saturday: {
      tasks: {},
      currentIndex: 0,
    },
    Sunday: {
      tasks: {},
      currentIndex: 0,
    },
  },
  currentDay: 'Monday',
};

const getUpdatedState = (state, currentDay, updatedDay) => (
  { ...state, weekPlan: { ...state.weekPlan, [currentDay]: updatedDay } }
);

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK: {
      const { currentDay } = state;
      const day = { ...state.weekPlan[currentDay] };
      const task = action.payload;
      const newTasks = { ...day.tasks };

      newTasks[day.currentIndex] = task;
      day.currentIndex += 1;
      day.tasks = newTasks;

      return getUpdatedState(state, currentDay, day);
    }
    case REMOVE_TASK: {
      const { currentDay } = state;
      const day = { ...state.weekPlan[currentDay] };
      const index = action.payload;
      const newTasks = { ...day.tasks };

      delete newTasks[index];
      day.tasks = newTasks;

      return getUpdatedState(state, currentDay, day);
    }
    case UPDATE_TASK: {
      const { currentDay } = state;
      const day = { ...state.weekPlan[currentDay] };
      const { task, smartAdjustmentsOn } = action.payload;
      let newTasks = { ...day.tasks };

      const difference = getYDifference(newTasks, task);
      if (difference >= 1500) return state; // only glitch can make this happen

      if (smartAdjustmentsOn) {
        newTasks = adjustFollowingTasks(newTasks, task);
      }

      newTasks[task.index] = task;

      day.tasks = newTasks;

      return getUpdatedState(state, currentDay, day);
    }
    case SET_CURRENT_DAY: {
      const newDay = action.payload;
      return { ...state, currentDay: newDay };
    }
    default:
      return state;
  }
};


const adjustFollowingTasks = (tasks, task) => {
  let newTasks = tasks;
  const difference = getYDifference(tasks, task);
  newTasks = _.mapValues(newTasks, (t) => {
    if (t.index > task.index) {
      const newT = t;
      newT.y += difference;
      return newT;
    }
    return t;
  });

  return newTasks;
};


const getYDifference = (tasks, task) => {
  const oldTask = tasks[task.index];
  const { y: oldY } = oldTask;
  const newY = task.y;
  const difference = newY - oldY;

  return difference;
};

export default TaskReducer;
