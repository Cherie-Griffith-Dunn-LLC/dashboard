import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getTrainingList = () => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_TRAINING_LIST);
};

const getCourseStatistics = () => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_COURSE_STATISTICS);
};

export {
    getTrainingList,
    getCourseStatistics,
};