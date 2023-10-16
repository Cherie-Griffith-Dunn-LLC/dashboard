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
}


export {
    getAlarms,
    getAllDWM
};