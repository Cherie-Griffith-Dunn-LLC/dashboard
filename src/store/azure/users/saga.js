import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { POST_USERS } from "./actionTypes";

import { postOrgUsersSuccess, postOrgUsersFail } from "./actions";

import { postUsers } from "../../../helpers/azure_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* addOrgUsers() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(postUsers);
        if (response.error) {
            throw new Error(response.error);
        }
        // save the current user in local storage
        yield put(postOrgUsersSuccess(response.message));
    } catch (error) {
        yield put(postOrgUsersFail(error));
    }
}

function* usersSaga() {
    yield takeEvery(POST_USERS, addOrgUsers);
}

export default usersSaga;