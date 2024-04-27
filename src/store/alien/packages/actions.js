import { 
    GET_PACKAGES,
    GET_PACKAGES_SUCCESS,
    GET_PACKAGES_FAIL,
 } from "./actionTypes"


 export const getPackages = (platform) => {
    return {
        type: GET_PACKAGES,
        payload: { platform },
    }
}

export const getPackagesSuccess = (response) => {
    return {
        type: GET_PACKAGES_SUCCESS,
        payload: response,
    }
}

export const getPackagesFail = (error) => {
    return {
        type: GET_PACKAGES_FAIL,
        payload: error,
    }
}