import { 
    GET_THREATS,
    GET_THREATS_SUCCESS,
    GET_THREATS_FAIL,
 } from "./actionTypes"


 export const getThreats = (size) => {
    return {
        type: GET_THREATS,
        payload: { size },
    }
}

export const getThreatsSuccess = (response) => {
    return {
        type: GET_THREATS_SUCCESS,
        payload: response,
    }
}

export const getThreatsFail = (error) => {
    return {
        type: GET_THREATS_FAIL,
        payload: error,
    }
}