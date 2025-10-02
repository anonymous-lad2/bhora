import { combineReducers } from 'redux';
import { authReducer } from './Authentication/authReducer'; 
import { taskReducer } from './Task/taskReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
});

export default rootReducer;