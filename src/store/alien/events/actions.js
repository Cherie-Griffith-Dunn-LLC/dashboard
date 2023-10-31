import { 
    GET_SYS_EVENTS,
    GET_SYS_EVENTS_SUCCESS,
    GET_SYS_EVENTS_FAIL,
 } from "./actionTypes"


 export const getSysEvents = (size) => {
    return {
        type: GET_SYS_EVENTS,
        payload: { size },
    }
}

export const getSysEventsSuccess = (response) => {
    return {
        type: GET_SYS_EVENTS_SUCCESS,
        payload: response,
    }
}

export const getSysEventsFail = (error) => {
    return {
        type: GET_SYS_EVENTS_FAIL,
        payload: error,
    }
}