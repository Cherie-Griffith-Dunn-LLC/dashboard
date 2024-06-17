import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getAlarms = (size, platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_ALARMS, { size, platform });
};

const getAllDWM = (size, platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_ALL_DWM, { size, platform});
};

const getEvents = (size, platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_EVENTS, { size, platform});
};

const getDictionaries = () => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_DICTIONARIES);
};

const getInvestigations = (size, platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_INVESTIGATIONS, { size, platform});
};

const getVulnerbilities = (size, platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_VULNERABILITIES, { size, platform});
};

const getPackages = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_PACKAGES, { platform });
}

export {
    getAlarms,
    getAllDWM,
    getEvents,
    getDictionaries,
    getInvestigations,
    getVulnerbilities,
    getPackages
};