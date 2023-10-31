import { 
    GET_TRAINING_LIST,
    GET_TRAINING_LIST_SUCCESS,
    GET_TRAINING_LIST_FAIL,
 } from "./actionTypes"


 export const getEmployeeTrainingList = () => {
    return {
        type: GET_TRAINING_LIST,
    }
}

export const getTrainingListSuccess = (response) => {
    return {
        type: GET_TRAINING_LIST_SUCCESS,
        payload: response,
    }
}

export const getTrainingListFail = (error) => {
    return {
        type: GET_TRAINING_LIST_FAIL,
        payload: error,
    }
}