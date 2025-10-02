import { api } from "../../Config/api"; // Assuming your configured axios instance
import {
    CREATE_TASK_REQUEST, CREATE_TASK_SUCCESS, CREATE_TASK_FAILURE,
    UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILURE,
    GET_ALL_TASKS_REQUEST, GET_ALL_TASKS_SUCCESS, GET_ALL_TASKS_FAILURE,
    GET_TASKS_BY_STATUS_REQUEST, GET_TASKS_BY_STATUS_SUCCESS, GET_TASKS_BY_STATUS_FAILURE,
    UPDATE_TASK_STATUS_REQUEST, UPDATE_TASK_STATUS_SUCCESS, UPDATE_TASK_STATUS_FAILURE,
    DELETE_TASK_REQUEST, DELETE_TASK_SUCCESS, DELETE_TASK_FAILURE,
} from "./TaskActionTypes";

const getAuthHeaders = (jwt) => ({
    headers: {
        Authorization: `Bearer ${jwt}`,
    },
});

// --- 1. POST For creating a task ---
export const createTask = (reqData, jwt) => async (dispatch) => {
    dispatch({ type: CREATE_TASK_REQUEST });
    try {
        const { data } = await api.post(
            `/task/createTask`, // Placeholder endpoint
            reqData.task, // Assumes task data is in reqData.task
            getAuthHeaders(jwt)
        );
        dispatch({ type: CREATE_TASK_SUCCESS, payload: data.data }); // Assuming new task object is in data.data
        console.log("Task created:", data);
    } catch (error) {
        dispatch({ type: CREATE_TASK_FAILURE, payload: error.response?.data?.message || error.message });
        console.error("Create Task Error:", error);
    }
};

// --- 2. PUT For updating the task ---
export const updateTask = (taskId, updateData, jwt) => async (dispatch) => {
    dispatch({ type: UPDATE_TASK_REQUEST });
    try {
        const { data } = await api.put(
            `/task/updateTask/${taskId}`, // Placeholder endpoint with ID
            updateData,
            getAuthHeaders(jwt)
        );
        dispatch({ type: UPDATE_TASK_SUCCESS, payload: data.data }); // Assuming updated task object is in data.data
        console.log("Task updated:", data);
    } catch (error) {
        dispatch({ type: UPDATE_TASK_FAILURE, payload: error.response?.data?.message || error.message });
        console.error("Update Task Error:", error);
    }
};

// --- 3. GET For getting all the tasks ---
export const getAllTasks = (jwt) => async (dispatch) => {
    dispatch({ type: GET_ALL_TASKS_REQUEST });
    try {
        const { data } = await api.get(
            `/task/getAllTasks`, // Placeholder endpoint
            getAuthHeaders(jwt)
        );
        dispatch({ type: GET_ALL_TASKS_SUCCESS, payload: data.data }); // Assuming array of tasks is in data.data
        console.log("All tasks fetched:", data);
    } catch (error) {
        dispatch({ type: GET_ALL_TASKS_FAILURE, payload: error.response?.data?.message || error.message });
        console.error("Get All Tasks Error:", error);
    }
};

// --- 4. GET For getting the task Status ---
// This assumes the API filters tasks by a given status (e.g., 'In Progress')
export const getTasksByStatus = (status, jwt) => async (dispatch) => {
    dispatch({ type: GET_TASKS_BY_STATUS_REQUEST });
    try {
        const { data } = await api.get(
            `${TASK_API_PATH}/status?status=${status}`, // Placeholder endpoint with query param
            getAuthHeaders(jwt)
        );
        dispatch({ type: GET_TASKS_BY_STATUS_SUCCESS, payload: data.data }); // Assuming array of tasks is in data.data
        console.log(`Tasks for status ${status} fetched:`, data);
    } catch (error) {
        dispatch({ type: GET_TASKS_BY_STATUS_FAILURE, payload: error.response?.data?.message || error.message });
        console.error("Get Tasks By Status Error:", error);
    }
};

// --- 5. PATCH For updating the task Status ---
export const updateTaskStatus = (taskId, newStatus, jwt) => async (dispatch) => {
    dispatch({ type: UPDATE_TASK_STATUS_REQUEST });
    try {
        const { data } = await api.patch(
            `/task/updateTaskStatus/${taskId}`, // Placeholder endpoint
            { status: newStatus }, // Assumes request body is { status: "NEW_STATUS" }
            getAuthHeaders(jwt)
        );
        dispatch({ type: UPDATE_TASK_STATUS_SUCCESS, payload: data.data }); // Assuming updated task object is in data.data
        console.log(`Task status updated for ID ${taskId}:`, data);
    } catch (error) {
        dispatch({ type: UPDATE_TASK_STATUS_FAILURE, payload: error.response?.data?.message || error.message });
        console.error("Update Task Status Error:", error);
    }
};

// --- 6. DEL For Deleting the task ---
export const deleteTask = (taskId, jwt) => async (dispatch) => {
    dispatch({ type: DELETE_TASK_REQUEST });
    try {
        await api.delete(
            `/task/deleteTask/${taskId}`, // Placeholder endpoint with ID
            getAuthHeaders(jwt)
        );
        dispatch({ type: DELETE_TASK_SUCCESS, payload: taskId }); // Payload is the ID of the deleted task
        console.log(`Task deleted with ID ${taskId}`);
    } catch (error) {
        dispatch({ type: DELETE_TASK_FAILURE, payload: error.response?.data?.message || error.message });
        console.error("Delete Task Error:", error);
    }
};