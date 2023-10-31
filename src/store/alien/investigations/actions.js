import { 
    GET_INVESTIGATIONS,
    GET_INVESTIGATIONS_SUCCESS,
    GET_INVESTIGATIONS_FAIL,
 } from "./actionTypes"


 export const getInvestigations = (size, priority) => {
    return {
        type: GET_INVESTIGATIONS,
        payload: { size, priority },
    }
}

export const getInvestigationsSuccess = (response) => {
    return {
        type: GET_INVESTIGATIONS_SUCCESS,
        payload: response,
    }
}

export const getInvestigationsFail = (error) => {
    return {
        type: GET_INVESTIGATIONS_FAIL,
        payload: error,
    }
}