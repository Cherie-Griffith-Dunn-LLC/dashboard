import { 
    GET_ALARMS,
    GET_ALARMS_SUCCESS,
    GET_ALARMS_FAIL,
 } from "./actionTypes"


 export const getAlarms = (size, priority) => {
    return {
        type: GET_ALARMS,
        payload: { size, priority },
    }
}

export const getAlarmsSuccess = (response) => {
    return {
        type: GET_ALARMS_SUCCESS,
        payload: response,
    }
}

export const getAlarmsFail = (error) => {
    return {
        type: GET_ALARMS_FAIL,
        payload: error,
    }
}