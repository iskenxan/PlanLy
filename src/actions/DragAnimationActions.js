
export const TASK_DATA_RECEIVED = 'action:drag_data_received';
export const DROP_WIDTH_RECEIVED = 'action:drop_width_received';
export const SET_ELEVATED_TASK = 'action:set_elevated_task';
export const TASK_DROPPED = 'action:task_dropped';


export const onDropWidth = width => ({
  type: DROP_WIDTH_RECEIVED,
  payload: width,
});


export const onTaskDataReceived = (title, duration) => ({
  type: TASK_DATA_RECEIVED,
  payload: { title, duration },
});


export const setElevatedIndex = index => ({
  type: SET_ELEVATED_TASK,
  payload: index,
});
