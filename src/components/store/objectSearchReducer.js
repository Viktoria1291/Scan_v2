import {ACTIONS} from './actions';


const initialState = {
    histograms: null,
    searchResultItem: [],
    scanDoc: [],
}

const objectSearchReducer = (state = initialState, action) => {
    switch(action.type) {

        case ACTIONS.ADD_HISTOGRAM:
            return {
                ...state,
                histograms: action.data,
            }

        case ACTIONS.ADD_SEARCHRESULTITEM:
            return {
                ...state,
                searchResultItem: action.data,
            }

        case ACTIONS.ADD_SCANDOC:
            return {
                ...state,
                scanDoc: action.data,
            }
            
        case ACTIONS.REMOVE_OBJECT_SEARCH:
            return {
                histograms: null,
                searchResultItem: [],
                scanDoc: [],
            }

        default:
            return state
    }
}

export default objectSearchReducer;