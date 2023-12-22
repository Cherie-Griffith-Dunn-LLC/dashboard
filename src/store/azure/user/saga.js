import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_CURRENT_USER } from "./actionTypes";

import { getCurrentUserSuccess, getCurrentUserFail } from "./actions";

import { getCurrentUser } from "../../../helpers/azure_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchCurrentUser() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform  = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getCurrentUser, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        // save the current user in local storage
        localStorage.setItem("authUser", JSON.stringify(response));
        yield put(getCurrentUserSuccess(response));
    } catch (error) {
        yield put(getCurrentUserFail(error));
    }
}

function* userSaga() {
    yield takeEvery(GET_CURRENT_USER, fetchCurrentUser);
}

export default userSaga;