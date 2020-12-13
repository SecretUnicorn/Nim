import { faCrown, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow, Typography, withStyles } from "@material-ui/core"
import React from "react"

const styles = theme => createStyles({ // change to this

    root: {
        textAlign: 'center'
    }
});

const GameOverScreen = (props) => {

    const {open, player_won, Transition, onClick, classes} = props 

    const onClicked = () => {
        console.log("HEY")
        onClick()
    }

    return (
        <Dialog
            classes={{root:classes.root, scrollPaper: classes.scrollPaper }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="md"
            onClose={onClicked}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">
                GAME OVER
            </DialogTitle>
            <DialogContent>
                <FontAwesomeIcon icon={player_won ? faCrown : faHeartBroken} size="5x"/>
                <Typography variant="h4" style={{marginTop: '1em'}}>
                    {
                        player_won ?
                            "Good job! You defeated the AI" : "Game Over. The AI has won!"
                    }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClicked} color="secondary">Retry</Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(GameOverScreen)