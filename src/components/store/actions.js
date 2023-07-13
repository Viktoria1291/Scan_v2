export const ACTIONS = {
    DISPLAY_AUTHORIZATION: 'DISPLAY_AUTHORIZATION',
    SHOW_HIDE_PASSWORD: 'SHOW_HIDE_PASSWORD',
    SENDING_REQUEST_AUT: 'SEND_REQUEST_AUT',
    GET_RESPONSE_AUT: 'GET_RESPONSE_AUT',
    GET_RESPONSE_ACCOUNT_SETTINGS: 'GET_RESPONSE_ACCOUNT_SETTINGS',
    GET_ERROR_ACCOUNT_SETTINGS: 'GET_ERROR_ACCOUNT_SETTINGS',
    LOG_OUT_ACCOUNT: 'LOG_OUT_ACCOUNT',
    ADD_HISTOGRAM: 'ADD_HISTOGRAM',
    ADD_SEARCHRESULTITEM: 'ADD_SEARCHRESULTITEM',
    ADD_SCANDOC: 'ADD_SCANDOC',
    REMOVE_OBJECT_SEARCH: 'REMOVE_OBJECT_SEARCH'
}


// сделать активной форму авторизации
export const displayAuthorization = () => {
    return {
        type: ACTIONS.DISPLAY_AUTHORIZATION,
    }
}

// показать/скрыть пароль
export const showHidePassword = () => {
    return {
        type: ACTIONS.SHOW_HIDE_PASSWORD,
    }
}

// отправление запроса на сервер на авторизацию
export const sendingRequestAut = (flag) => {
    return {
        type: ACTIONS.SENDING_REQUEST_AUT,
        flag
    }
}

// получение ответа сервера на запрос авторизации
export const getResponseAut = (response) => {
    return {
        type: ACTIONS.GET_RESPONSE_AUT,
        response
    }
}

// поучение ответа сервера на запрос параметров аккаунта
export const getResponseAccountSettings = (response) => {
    return {
        type: ACTIONS.GET_RESPONSE_ACCOUNT_SETTINGS,
        response
    }
}

// получение ошибки от сервера на запрос параметров аакаунта
export const getErrorAccountSettings = (status) => {
    return {
        type: ACTIONS.GET_ERROR_ACCOUNT_SETTINGS,
        status
    }
}

// выйти из личного кабинета
export const logOutAccount = () => {
    return {
        type: ACTIONS.LOG_OUT_ACCOUNT,
    }
}

// добавить в стейт гистограмму
export const addHistogram = (data) => {
    return {
        type: ACTIONS.ADD_HISTOGRAM,
        data,
    }
}

// добавить в стейт id найденных публикаций
export const addSearchResultItem = (data) => {
    return {
        type: ACTIONS.ADD_SEARCHRESULTITEM,
        data,
    }
}

// добавить в стейт скандок 
export const addScanDoc = (data) => {
    return {
        type: ACTIONS.ADD_SCANDOC,
        data,
    }
}

// удаление данных предыдущего поиска
export const removeObjectSearch = () => {
    return {
        type: ACTIONS.REMOVE_OBJECT_SEARCH
    }
}

















