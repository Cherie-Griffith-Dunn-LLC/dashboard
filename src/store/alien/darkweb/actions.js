import { 
    GET_ALL_DWM,
    GET_ALL_DWM_SUCCESS,
    GET_ALL_DWM_FAIL,
 } from "./actionTypes"


 export const getAllDWM = (size) => {
    return {
        type: GET_ALL_DWM,
        payload: { size },
    }
}

export const getAllDWMSuccess = (response) => {
    return {
        type: GET_ALL_DWM_SUCCESS,
        payload: response,
    }
}

export const getAllDWMFail = (error) => {
    return {
        type: GET_ALL_DWM_FAIL,
        payload: error,
    }
}