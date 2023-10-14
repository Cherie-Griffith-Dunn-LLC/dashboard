import { 
    GET_TENANT_ID,
    GET_TENANT_ID_SUCCESS,
    GET_TENANT_ID_FAIL
 } from "./actionTypes"

export const getTenantId = (email, history) => {
    return {
        type: GET_TENANT_ID,
        payload: { email, history },
    }
}

export const getTenantIdSuccess = (response) => {
    return {
        type: GET_TENANT_ID_SUCCESS,
        payload: response,
    }
}

export const getTenantIdFail = (error) => {
    return {
        type: GET_TENANT_ID_FAIL,
        payload: error,
    }
}