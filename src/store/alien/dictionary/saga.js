import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_DICTIONARIES } from "./actionTypes";

import { getDictionaryFail, getDictionarySuccess } from "./actions";

import { getDictionaries } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchDictionary() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getDictionaries);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getDictionarySuccess(response));
    } catch (error) {
        yield put(getDictionaryFail(error));
    }
}

function* dictionarySaga() {
    yield takeEvery(GET_DICTIONARIES, fetchDictionary);
}

export default dictionarySaga;