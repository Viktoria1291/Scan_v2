import { combineReducers } from "redux";
import loginReduсer from "./loginReducer";
import objectSearchReducer from "./objectSearchReducer";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const loginPersistConfig = {
    key: 'loginReduсer',
    storage: storage,
    whitelist: ['token', 'userData']
};

const objectSearchPersistConfig = {
    key: 'objectSearchReducer',
    storage: storage,
    whitelist: ['histograms', 'searchResultItem', 'scanDoc']
};

const rootReducer = combineReducers({
    loginReduсer: persistReducer(loginPersistConfig, loginReduсer),
    objectSearchReducer: persistReducer(objectSearchPersistConfig, objectSearchReducer)
})

export default rootReducer;