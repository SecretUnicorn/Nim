import store from "redux/store"
import _ from "loadsh"
import { CHANGE_SETTINGS, START_OPTIONS } from "redux/constants/settingsContants" 
import { GAME_OVER, INIT_GAME, START_GAME, STOP_GAME, TAKE_MINION } from "redux/constants/gamingConstans"
import GameLogic from "services/GameLogic"


export const changeSettings = (settingName, settingValue) => {
    return dispatch => {
        dispatch({
            type: CHANGE_SETTINGS,
            payload: {
                settingName: settingName,
                value: settingValue
            }
        })
        dispatch({type: STOP_GAME})
    }
}

export const init_game = () => {
    return dispatch => {
        const {startOption, totalMinionAmount} = store.getState().settings
    
        if (startOption === START_OPTIONS.RANDOM) var player_turn = _.sample([true, false])
        else player_turn = startOption === START_OPTIONS.YOU

        let evil_position = _.random(2, totalMinionAmount -2, false)
        dispatch({
            type: INIT_GAME,
            payload: {
                player_turn,
                evil_position,
                amount_left: totalMinionAmount - (totalMinionAmount - evil_position) - 1,
                amount_right: totalMinionAmount - evil_position
            }
        })
    }
}


export const startGame = () => {
    return dispatch => {
        dispatch({
            type: START_GAME
        })

        if(!store.getState().game.player_turn) {
            setTimeout(() => {
                dispatch({
                    type: TAKE_MINION,
                    payload: GameLogic.aiMove()
                })
            }, 2000)
        }
    }
    

}


export const restart = () => {
    return dispatch => {
        dispatch(init_game())
        dispatch(startGame())
    }
}


export const playerMove = (fromLeft, amount) => {
    return dispatch => {
        if(GameLogic.checkGameOver()) {
            dispatch({type: GAME_OVER})
        } else {
            dispatch({
                type: TAKE_MINION,
                payload: {
                    side: fromLeft ? 'left' : 'right',
                    amount
                }
            })
            if(GameLogic.checkGameOver()) {
                dispatch({type: GAME_OVER})
            } else {
                setTimeout(() => {
                    dispatch({
                        type: TAKE_MINION,
                        payload: GameLogic.aiMove()
                    })
                    if(GameLogic.checkGameOver()) {
                        dispatch({type: GAME_OVER})
                    }
                }, 1500)
            }
        }
    }
}