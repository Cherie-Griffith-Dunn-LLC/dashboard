import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_CURRENT_ROLE } from "./actionTypes";

import { getCurrentRoleSuccess, getCurrentRoleFail } from "./actions";

import { getCurrentRole } from "../../../helpers/azure_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchCurrentRole() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getCurrentRole);
        if (response.error) {
            // try one more time
            const secondresponse = yield call(getCurrentRole);
            if (secondresponse.error) {
                throw new Error(secondresponse.error);
            }
            localStorage.setItem("role", secondresponse.role);
            yield put(getCurrentRoleSuccess(secondresponse.role));
        }
        localStorage.setItem("role", response.role);
        yield put(getCurrentRoleSuccess(response.role));
    } catch (error) {
        yield put(getCurrentRoleFail(error));
    }
}

function* roleSaga() {
    yield takeEvery(GET_CURRENT_ROLE, fetchCurrentRole);
}

export default roleSaga;