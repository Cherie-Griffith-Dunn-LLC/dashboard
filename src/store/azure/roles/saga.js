import { call, put, takeEvery, takeLatest, all } from "redux-saga/effects";

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
            throw new Error(response.error);
        }
        console.log(response);
        yield put(getCurrentRoleSuccess(response));
    } catch (error) {
        yield put(getCurrentRoleFail(error));
    }
}

function* roleSaga() {
    yield takeEvery(GET_CURRENT_ROLE, fetchCurrentRole);
}

export default roleSaga;