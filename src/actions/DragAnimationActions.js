
// export const DRAG_CHANGED = "action:drag_changed";
export const TASK_DATA_RECEIVED = "action:drag_data_received"
export const DROP_WIDTH_RECEIVED = "action:drop_width_received"


// export const onDragChanged = (dragging) => {
//     return {
//         type: DRAG_CHANGED,
//         payload: dragging
//     }
// }


export const onDropWidth = (width) => {
    console.log('dropWidth')
    return {
        type: DROP_WIDTH_RECEIVED,
        payload: width
    }
}


export const onTaskDataReceived = (title, duration) => {
    return {
        type: DRAG_CHANGED,
        payload: { title, duration }
    }
}