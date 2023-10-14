import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getTenantId = (email) => {
    const apiClient = new APIClient();
    return apiClient.create(url.GET_TENANT_ID, { email });
};

export {
    getTenantId
};