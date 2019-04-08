export const ADD_TASK = 'action:add_task';
export const REMOVE_TASK = 'action:remove_task';
export const REMOVE_ALL_TASKS = 'actiom:remove_all_tasks';
export const UPDATE_TASK = 'action:update_task';
export const SET_TASK_NOTIFICATION = 'action: set_task_notification';
export const SET_CURRENT_DAY = 'action:set_current_day';


export const setCurrentDay = newDay => ({
  type: SET_CURRENT_DAY,
  payload: newDay,
});

export const addTask = task => ({
  type: ADD_TASK,
  payload: task,
});


export const removeAllTasks = () => ({
  type: REMOVE_ALL_TASKS,
});


export const removeTask = index => ({
  type: REMOVE_TASK,
  payload: index,
});


export const updateTask = (task, smartAdjustmentsOn) => ({
  type: UPDATE_TASK,
  payload: {
    task,
    smartAdjustmentsOn,
  },
});
