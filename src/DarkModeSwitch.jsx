import { faCog, faGamepad, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab, Grid, makeStyles, SvgIcon } from '@material-ui/core'
import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow, Typography } from "@material-ui/core"
import { NavLink, Route, useLocation } from 'react-router-dom';
import {
    Switch,
} from "react-router-dom";

import { ReactComponent as DarkLightLogo } from "static/images/darklighticon.svg"


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow ref={ref} {...props} />;
});


const useStyles = makeStyles((t) => ({
    wrapper: {
        position: 'absolute',
        top: t.spacing(2),
        right: t.spacing(2),
    },
    themeToggle: {
        color: t.palette.background.default,
        backgroundColor: t.palette.text.primary,
        '&:hover': {
            backgroundColor: t.palette.background.paper,
            color: t.palette.text.primary,
        }
    },
    
    dialogRoot: {
        textAlign: 'center'
    }
}));


export default function DarkModeSwitch(props) {

    const { onClick } = props
    const location = useLocation();

    const [open, setOpen] = useState(false)

    const classes = useStyles();

    return (
        <Grid container direction="column" spacing={1} justifyContent="flex-end" alignItems="flex-end" className={classes.wrapper}>
            <Dialog
            classes={{root:classes.root, scrollPaper: classes.scrollPaper }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="xs"
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">
                How to Play
            </DialogTitle>
            <DialogContent>
                Welcome Agent, <br/><br/>
                your mission is to kill the enemy agents without killing <b>Norbert</b>!
                Each round you <u>have to</u> choose Agents left or right from <b>Norbert</b>.
                The Person that has to choose Norbert looses.<br/><br/>
                Good Luck!
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">Dismiss</Button>
            </DialogActions>
        </Dialog>
            <Grid item>
                <NavLink to={location.pathname.indexOf("settings") > -1 ? '/' : '/settings'}>
                    <Fab className={classes.themeToggle}>
                        <Switch>
                            <Route exact path="/">
                                <FontAwesomeIcon size="2x" icon={faCog}/>
                            </Route>
                            <Route exact path="/settings">
                                <FontAwesomeIcon size="2x" icon={faGamepad}/>
                            </Route>
                        </Switch>
                    </Fab>
                </NavLink>
            </Grid>
            <Grid item>
                <Fab className={classes.themeToggle} onClick={onClick}>
                    <SvgIcon>
                        <DarkLightLogo />
                    </SvgIcon>
                </Fab>
            </Grid>
            <Grid item>
                <Fab className={classes.themeToggle} onClick={() => setOpen(true)}>
                    <SvgIcon>
                        <FontAwesomeIcon size="2x" icon={faQuestion}/>
                    </SvgIcon>
                </Fab>
            </Grid>
        </Grid>
    )
}
