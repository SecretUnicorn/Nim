import { faDizzy, faGrimace, faMehBlank, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Grow, IconButton, Input, Slider, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@material-ui/core'
import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { init_game, playerMove, restart, startGame } from "redux/actions"
import GameOverScreen from './GameOverScreen'
import Loader from 'react-loader-spinner'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow ref={ref} {...props} />;
});


const Game = (props) => {

    const {totalMinionAmount, amount_left, amount_right, evil_position, player_turn, endTurn, game_over, player_won, start_game, gameRunning} = props
    const theme = useTheme()
    const [clicked, setClicked] = useState([])
    const [lastSideLeft, setLastSide] = useState(true)
    const maxAmount = props.maxTake
    const [stillIngame, setStillInGame] = useState([])

    const onMinionClick = (i, wasRemove) => {
        const idx = i + 1
        if(!player_turn) return;
        if(idx === evil_position) return;
        let list = Array.from(clicked)
        if(idx < evil_position && amount_left > 0) {
            if(!lastSideLeft) {
                list = []
                setLastSide(true)
            } else if(wasRemove) {
                list.pop()
                setClicked(list)
                return;
            }
            if(amount_left === list.length || list.length === maxAmount) return;

            list.push(totalMinionAmount - (totalMinionAmount - evil_position) - amount_left + list.length)
        } else if(idx >= evil_position && amount_right > 0){
            if(lastSideLeft) {
                list = []
                setLastSide(false)
            } else if(wasRemove) {
                list.pop()
                setClicked(list)
                return;
            }
            if(amount_right === list.length || list.length === maxAmount) return;
            list.push(evil_position + amount_right - list.length)
        }
        setClicked(list)
    }

    const getColor = (idx) => {
        if(idx === evil_position) return theme.palette.secondary.main
        return clicked.includes(idx) ? theme.palette.secondary : theme.palette.grey["600"]
    }

    useEffect(() => {
        if(gameRunning) {
            let still_ingame = Array.from(Array(totalMinionAmount).keys())
            Array.from(Array(totalMinionAmount - (totalMinionAmount - evil_position) - amount_left)).map(() => still_ingame.shift())
            Array.from(Array(totalMinionAmount - evil_position - amount_right)).map(() => still_ingame.pop())
            setStillInGame([...still_ingame])
        }
        setClicked([])
    }, [amount_left, amount_right])

    const getIcon = (idx) => {
        if(idx === evil_position) return faGrimace
        // 0 1 2 3 4 5 6 7 8 9
        // - 1 2 X 4 5 6 7 8 -
        // 2 ? 0 1 2
        if(stillIngame.includes(idx > evil_position ? idx-1 : idx)) return faMehBlank
        else return faDizzy
    }

    const onTurnEnd = () => {
        endTurn(lastSideLeft, clicked.length)
    }

    const getSize = () => {
        if(totalMinionAmount < 10) return "5x"
        else if(totalMinionAmount < 20) return "4x"
        else if(totalMinionAmount < 25) return "3x"
        else if(totalMinionAmount < 35) return "2x"
    }


    return (
        <Grid container direction="column" spacing={3}>
            
            <GameOverScreen Transition={Transition} open={game_over} onClick={() => start_game()} player_won={player_won}/>
            <Grid item>
                Select with left click, deselect with right click or the minus symbol
            </Grid>
            <Grid item container spacing={1}>
                <IconButton onClick={() => onMinionClick(0, true)}>
                    <FontAwesomeIcon icon={faMinusCircle}/>
                </IconButton>
                {Array.from(Array(totalMinionAmount).keys()).map(k => 
                    <Grid item xs key={`minion-${k}`} onContextMenu={(e) => {e.preventDefault(); onMinionClick(k, true)}} onClick={() => onMinionClick(k, false)}>
                        <FontAwesomeIcon 
                            icon={getIcon(k+1)}
                            color={getColor(k+1)}
                            size={getSize()}
                        />
                    </Grid>
                )}
                <IconButton onClick={() => onMinionClick(totalMinionAmount-1, true)}>
                    <FontAwesomeIcon icon={faMinusCircle}/>
                </IconButton>
                
            </Grid>
            {player_turn ? 
            [<Grid item>
                <Typography variant="h6">{clicked.length} / {props.maxTake}</Typography>
            </Grid>,
            <Grid item>
                <Button color="secondary" onClick={onTurnEnd} disabled={clicked.length === 0}>Confirm Action</Button>
            </Grid>]
            :
            <Grid item>
                <Loader type="ThreeDots" color={theme.palette.text.primary} height={80} width={80} />
            </Grid>
            }
        </Grid>
    )
}













const GameWrapper = (props) => {

    const {start_game, gameRunning, initGame, restartGame} = props
    
    useEffect(() => {
        initGame()
    }, [])

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center" alignItems="center" direction="column" style={{minHeight: '100vh'}} spacing={5}>
                <Grid item>
                    <Typography variant="h2">MISSION DO NOT KILL NORBERT</Typography>
                </Grid>
                {gameRunning ? 
                <Grid item>
                    <Game {...{...props, start_game: () => restartGame()}}/>
                </Grid>
                :
                <Grid item>
                    <Button color="secondary" onClick={() => start_game()}>Start Game</Button>
                </Grid>
                }
            </Grid>
        </Container>
    )
}


export default connect(
    state => {
        return {
            gameRunning: state.game.gameRunning,
            totalMinionAmount: state.settings.totalMinionAmount,
            amount_left: state.game.amount_left,
            amount_right: state.game.amount_right,
            evil_position: state.game.evil_position,
            player_turn: state.game.player_turn,
            game_over: state.game.game_over,
            player_won: state.game.player_won,
            maxTake: state.settings.maxTake
        }
    }, dispatch => {
        return {
            start_game: () => dispatch(startGame()),
            initGame: () => dispatch(init_game()),
            endTurn: (fromLeft, amount) => dispatch(playerMove(fromLeft, amount)),
            restartGame: () => dispatch(restart())
        }
    })(GameWrapper)

