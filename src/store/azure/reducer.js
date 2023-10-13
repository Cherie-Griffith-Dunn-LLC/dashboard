import { GET_TENANT_ID  } from "./actionTypes";

const INIT_STATE = {
    tenantId: "",
}

const azure = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_TENANT_ID:
            return {
                ...state,
                tenantId: action.payload,
            }
        default:
            return state
    }
}

export default azure