import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getTenantId = (email) => {
    const apiClient = new APIClient();
    return apiClient.create(url.GET_TENANT_ID, { email });
};

// Get the current logged in user's information
const getCurrentUser = () => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_CURRENT_USER);
};

export {
    getTenantId,
    getCurrentUser,
};