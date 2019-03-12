
export const TASK_DATA_RECEIVED = "action:drag_data_received"
export const DROP_WIDTH_RECEIVED = "action:drop_width_received"



export const onDropWidth = (width) => {
    return {
        type: DROP_WIDTH_RECEIVED,
        payload: width
    }
}


export const onTaskDataReceived = (title, duration) => {
    return {
        type: TASK_DATA_RECEIVED,
        payload: { title, duration }
    }
}