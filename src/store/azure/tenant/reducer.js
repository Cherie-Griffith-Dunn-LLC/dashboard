import { GET_TENANT_ID_FAIL, GET_TENANT_ID_SUCCESS, GET_TENANT_ID  } from "./actionTypes";

const INIT_STATE = {
    tenantId: "",
    platform: "",
    error: "",
    loading: true,
}

const azureTenantId = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_TENANT_ID:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_TENANT_ID_SUCCESS:
            state = {
                ...state,
                tenantId: action.payload,
                loading: false,
            };
            break;
        case GET_TENANT_ID_FAIL:
            state = {
                ...state,
                error: action.payload,
                loading: false,
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default azureTenantId;