import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getTenantId = (email) => {
    const apiClient = new APIClient();
    return apiClient.create(url.GET_TENANT_ID, { email });
};

// Get the current logged in user's information
const getCurrentUser = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_CURRENT_USER, { platform });
};

const getCurrentRole = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_CURRENT_ROLE, { platform });
};

const postUsers = (platform) => {
    const apiClient = new APIClient();
    return apiClient.create(url.POST_ORG_USERS, { platform });
}

export {
    getTenantId,
    getCurrentUser,
    getCurrentRole,
    postUsers,
};