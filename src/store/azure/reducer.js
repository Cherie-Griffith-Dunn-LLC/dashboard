import { GET_TENANT_ID_FAIL, GET_TENANT_ID_SUCCESS  } from "./actionTypes";

const INIT_STATE = {
    tenantId: "",
}

const azureTenantId = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_TENANT_ID_SUCCESS:
            return {
                ...state,
                tenantId: action.payload,
            }
        case GET_TENANT_ID_FAIL:
            return {
                ...state,
                error: action.payload,
            }
        default:
            return state;
    }
}

export default azureTenantId;