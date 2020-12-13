import { CHANGE_SETTINGS, START_OPTIONS } from "redux/constants/settingsContants"
import Cookies from "js-cookie"
import { CHANGE_TURN, GAME_OVER, INIT_GAME, START_GAME, STOP_GAME, TAKE_MINION } from "redux/constants/gamingConstans"

let cookie = Cookies.get("norbert-settings")
cookie = cookie ? cookie : "{}"

const initial_state = {
    amount_left: -1,
    amount_right: -1,
    evil_position: -1,
    player_turn: false,
    gameRunning: false,
    game_over: false,
    player_won: false
}

const GamingReducer = (state=initial_state, action) => {
    switch(action.type) {
        case TAKE_MINION: {
            return {
                ...state,
                player_turn: !state.player_turn,
                [`amount_${action.payload.side}`]: state[`amount_${action.payload.side}`] - action.payload.amount
            }
        }
        case INIT_GAME:
            return {
                ...initial_state,
                gameRunning: false,
                ...action.payload
            }
        case START_GAME:
            return {
                ...state,
                gameRunning: true,
            }
        case STOP_GAME:
            return {
                ...state,
                gameRunning: false
            }
        case GAME_OVER: 
            return {
                ...initial_state,
                gameRunning: true,
                game_over: true,
                player_won: !state.player_turn
            }
        default:
            return state
    }
}



export default GamingReducer