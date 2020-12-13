import { CHANGE_SETTINGS, START_OPTIONS } from "redux/constants/settingsContants"
import Cookies from "js-cookie"

let cookie = Cookies.get("norbert-settings")
cookie = cookie ? cookie : "{}"

const initial_state = {
    hardMode: true,
    totalMinionAmount: 11,
    maxTake: 3,
    startOption: START_OPTIONS.RANDOM,
    ...JSON.parse(cookie)    
}

const SettingsReducer =  (state=initial_state, action) => {
    var newState = state
    switch(action.type) {
        case CHANGE_SETTINGS:
            newState = {
                ...state,
                [action.payload.settingName]: action.payload.value
            }
            break;
        
        default:
            return state
    }
    let cookies = Cookies.get("norbert-settings")
    cookies = cookies ? JSON.parse(cookies) : {}
    cookies = {...cookies, ...newState, [action.payload.settingName]: action.payload.value}
    Cookies.set("norbert-settings", JSON.stringify(cookies))
    return newState
}



export default SettingsReducer