import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_TENANT_ID } from "./actionTypes";

import { getTenantIdSuccess, getTenantIdFail } from "./actions";

import { getTenantId } from "../../../helpers/azure_helper";

function* fetchTenantId({ payload: { email, history }}) {
    try {
        const response = yield call(getTenantId, email);
        // check if error in response
        if (response.error) {
            // throw error
            throw new Error(response.error);
        } else if (response.tenantId) {
            // add the email to response
            response.email = email;
            yield put(getTenantIdSuccess(response));
            // redirect to OAuth page with tenantId as param
            history(`/OAuth/${response.tenantId}`)
        }
    } catch (error) {
        yield put(getTenantIdFail(error));
    }
}


function* azureSaga() {
    yield takeEvery(GET_TENANT_ID, fetchTenantId);
}

export default azureSaga;