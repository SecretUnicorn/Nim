import { combineReducers } from 'redux'
import GamingReducer from './GamingReducer'
import SettingsReducer from './SettingsReducer'

const rootReducer = combineReducers({
    settings: SettingsReducer,
    game: GamingReducer
})

export default rootReducer