import { 
    GET_PACKAGES,
    GET_PACKAGES_SUCCESS,
    GET_PACKAGES_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    packages: [],
    error: "",
    loading: true,
}

const alienPackages = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_PACKAGES:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_PACKAGES_SUCCESS:
            state = {
                ...state,
                packages: action.payload,
                loading: false,
            };
            break;
        case GET_PACKAGES_FAIL:
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

export default alienPackages;