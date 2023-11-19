import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getAlarms = (size, priority) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_ALARMS, { size, priority });
};

const getAllDWM = (size) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_ALL_DWM, { size });
};

const getEvents = (size) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_EVENTS, { size });
};

const getDictionaries = () => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_DICTIONARIES);
};

const getInvestigations = (size) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_INVESTIGATIONS, { size });
};

const getVulnerbilities = (size) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_VULNERABILITIES, { size });
};

export {
    getAlarms,
    getAllDWM,
    getEvents,
    getDictionaries,
    getInvestigations,
    getVulnerbilities
};