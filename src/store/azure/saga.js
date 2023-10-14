import { call, put, takeEvery, takeLatest, all } from "redux-saga/effects";

// Redux States
import { GET_TENANT_ID } from "./actionTypes";

import { getTenantIdSuccess, getTenantIdFail } from "./actions";

import { getTenantId } from "../../helpers/azure_helper";

function* fetchTenantId(action) {
    try {
        const response = yield call(getTenantId, action.payload);
        // check if error in response
        if (response.error) {
            yield put(getTenantIdFail(response.error));
            return;
        } else if (response.tenantId) {
            yield put(getTenantIdSuccess(response.tenantId));
        }
    } catch (error) {
        yield put(getTenantIdFail(error));
    }
}


function* azureSaga() {
    yield takeEvery(GET_TENANT_ID, fetchTenantId);
}

export default azureSaga;