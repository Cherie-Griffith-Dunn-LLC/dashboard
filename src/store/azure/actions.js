import { GET_TENANT_ID } from "./actionTypes"

export const getTenantId = (data) => {
    return {
        type: GET_TENANT_ID,
        payload: data,
    }
}