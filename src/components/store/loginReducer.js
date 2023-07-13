import {ACTIONS} from './actions';


// если авторизация прошла успешно и записывается токен, то записываем в userData данный код:
import avatar from './images/samsung.jpg';
export const userData = {
    firstName: 'алексей',
    lastName: 'алексеев',
    avatar,
    tarif: 'pro'
}

const initialState = {
    passwordVisible: false,
    sendingRespAut: '',  
    token: null,
    errorRespAut: null,
    accountSettings: null,
    errorAccountSettings: null,
    userData: {}
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {

        case ACTIONS.DISPLAY_AUTHORIZATION:
            return {
                ...state,
                activeRegistration: false,
            }

        case ACTIONS.SHOW_HIDE_PASSWORD:
            return {
                ...state,
                passwordVisible: !state.passwordVisible,
            }

        case ACTIONS.DELETE_ERROR_BEFORE_SENDING:
            return {
                ...state,
                passwordVisible: !state.passwordVisible,
            }

            

        case ACTIONS.SENDING_REQUEST_AUT:
            return {
                ...state,
                sendingRespAut: action.flag,
            }

        case ACTIONS.GET_RESPONSE_AUT:
            if (state.sendingRespAut === 200) {
                return {
                    ...state,
                    token: action.response,
                    errorRespAut: null,
                    userData: userData,
                }
            } else {
                return {
                    ...state,
                    errorRespAut: action.response,
                    accessRespAut: null,
                }
            }

        case ACTIONS.GET_RESPONSE_ACCOUNT_SETTINGS:
            return {
                ...state,
                accountSettings: action.response,
                userData: userData,
            }

        case ACTIONS.GET_ERROR_ACCOUNT_SETTINGS:
            return {
                ...state,
                errorAccountSettings: action.status
            }

        case ACTIONS.LOG_OUT_ACCOUNT:
            return {
                ...state,
                sendingRespAut: '',  
                token: null,
                errorRespAut: null,
                accountSettings: null,
                errorAccountSettings: null,
                userData: {},
            }

        default:
            return state
    }
}

export default loginReducer;