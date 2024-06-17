import { APIClient } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getTrainingList = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_TRAINING_LIST, { platform });
};

const getCourseStatistics = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_COURSE_STATISTICS, { platform });
};

const getAssignedCourses = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_ASSIGNED_COURSES, { platform });
}

const getAllCoursesAssignments = (platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_ALL_ASSIGNMENTS_COURSES, { platform });
}

const getCourseUrl = (courseId, platform) => {
    const apiClient = new APIClient();
    return apiClient.get(url.GET_COURSE_URL, { courseId, platform });
}

export {
    getTrainingList,
    getCourseStatistics,
    getAssignedCourses,
    getAllCoursesAssignments,
    getCourseUrl
};