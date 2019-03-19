export const ADD_TASK = "action:add_task";
export const REMOVE_TASK = "action:remove_task";



export const addTask = (task) => {
    return {
        type: ADD_TASK,
        payload: task
    }
}


export const removeTask = (index) => {
    return {
        type: REMOVE_TASK,
        payload: index
    }
}