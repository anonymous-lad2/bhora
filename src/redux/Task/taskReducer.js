import {
    CREATE_TASK_REQUEST, CREATE_TASK_SUCCESS, CREATE_TASK_FAILURE,
    UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILURE,
    GET_ALL_TASKS_REQUEST, GET_ALL_TASKS_SUCCESS, GET_ALL_TASKS_FAILURE,
    GET_TASKS_BY_STATUS_REQUEST, GET_TASKS_BY_STATUS_SUCCESS, GET_TASKS_BY_STATUS_FAILURE,
    UPDATE_TASK_STATUS_REQUEST, UPDATE_TASK_STATUS_SUCCESS, UPDATE_TASK_STATUS_FAILURE,
    DELETE_TASK_REQUEST, DELETE_TASK_SUCCESS, DELETE_TASK_FAILURE,
} from "./ActionType";

const initialState = {
    tasks: [], // Array to hold all tasks
    filteredTasks: [], // Array to hold tasks fetched by status
    isLoading: false,
    error: null,
    success: null,
};

export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        // --- REQUEST CASES (Set loading, clear error/success) ---
        case CREATE_TASK_REQUEST:
        case UPDATE_TASK_REQUEST:
        case GET_ALL_TASKS_REQUEST:
        case GET_TASKS_BY_STATUS_REQUEST:
        case UPDATE_TASK_STATUS_REQUEST:
        case DELETE_TASK_REQUEST:
            return { ...state, isLoading: true, error: null, success: null };

        // --- SUCCESS CASES ---
        
        // GET ALL TASKS: Overwrite the main tasks list
        case GET_ALL_TASKS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: action.payload, // Assumes payload is an array of tasks
                error: null,
            };

        // GET TASKS BY STATUS: Update the filtered list
        case GET_TASKS_BY_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                filteredTasks: action.payload, // Assumes payload is an array of tasks
                error: null,
            };

        // CREATE TASK: Add the new task to the list
        case CREATE_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: [action.payload, ...state.tasks], // Prepend new task
                success: "Task created successfully",
            };

        // UPDATE & UPDATE STATUS: Map over tasks and replace the updated one
        case UPDATE_TASK_SUCCESS:
        case UPDATE_TASK_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: state.tasks.map(task =>
                    task._id === action.payload._id ? action.payload : task
                ),
                success: action.type === UPDATE_TASK_SUCCESS ? "Task updated successfully" : "Task status updated successfully",
            };

        // DELETE TASK: Filter the deleted task out of the list
        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: state.tasks.filter(task => task._id !== action.payload), // Assumes payload is the task ID
                success: "Task deleted successfully",
            };

        // --- FAILURE CASES (Set error) ---
        case CREATE_TASK_FAILURE:
        case UPDATE_TASK_FAILURE:
        case GET_ALL_TASKS_FAILURE:
        case GET_TASKS_BY_STATUS_FAILURE:
        case UPDATE_TASK_STATUS_FAILURE:
        case DELETE_TASK_FAILURE:
            return { ...state, isLoading: false, error: action.payload, success: null };

        default:
            return state;
    }
};