import { 
    GET_DICTIONARIES,
    GET_DICTIONARIES_SUCCESS,
    GET_DICTIONARIES_FAIL,
 } from "./actionTypes"


 export const getDictionary = () => {
    return {
        type: GET_DICTIONARIES,
    }
}

export const getDictionarySuccess = (response) => {
    return {
        type: GET_DICTIONARIES_SUCCESS,
        payload: response,
    }
}

export const getDictionaryFail = (error) => {
    return {
        type: GET_DICTIONARIES_FAIL,
        payload: error,
    }
}