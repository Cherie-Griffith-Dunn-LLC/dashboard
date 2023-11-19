import { 
    GET_VULNS,
    GET_VULNS_SUCCESS,
    GET_VULNS_FAIL,
 } from "./actionTypes"


 export const getVulns = (size) => {
    return {
        type: GET_VULNS,
        payload: { size },
    }
}

export const getVulnsSuccess = (response) => {
    return {
        type: GET_VULNS_SUCCESS,
        payload: response,
    }
}

export const getVulnsFail = (error) => {
    return {
        type: GET_VULNS_FAIL,
        payload: error,
    }
}