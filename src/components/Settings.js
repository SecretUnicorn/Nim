import { Container, Grid, Input, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeSettings } from "redux/actions"
import { START_OPTIONS } from 'redux/constants/settingsContants'


const Settings = (props) => {

    const { hardMode, totalMinionAmount, startOption, setSettings, maxTake } = props

    const handleSliderChange = (newValue, name) => {
        setSettings(name, newValue);
    };

    const handleInputChange = (event) => {
        setSettings("totalMinionAmount", event.target.value === '' ? 11 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (totalMinionAmount < 3) {
            setSettings("totalMinionAmount", 3);
        } else if (totalMinionAmount > 30) {
            setSettings("totalMinionAmount", 30);
        }
    };


    /* const handleBlur = () => {
        if (value < 0) {
            setSettings("totalMinionAmount", value);
        } else if (value > 100) {
          setValue(100);
        }
      }; */

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center" style={{ minHeight: '100vh', overflow: 'hidden' }}>
                <Grid item container direction="column" spacing={2}>
                    <Grid item style={{ marginBottom: '2em' }}>
                        <Typography variant="h1">
                            Settings
                </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">Difficulty</Typography>
                    </Grid>
                    <Grid item>
                        <ToggleButtonGroup name="hardMode" exclusive value={hardMode} onChange={(e, val) => setSettings("hardMode", val)}>
                            <ToggleButton name="hardMode" value={true}>
                                AI
                    </ToggleButton>
                            <ToggleButton name="hardMode" value={false}>
                                Random
                    </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">Start Player</Typography>
                    </Grid>
                    <Grid item>
                        <ToggleButtonGroup name="startOption" exclusive value={startOption} onChange={(e, val) => setSettings("startOption", val)}>
                            {Object.entries(START_OPTIONS).map(([key, value]) =>
                                <ToggleButton key={key} value={value}>
                                    {value}
                                </ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">Total Minion Amount</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={6}>
                                <Slider
                                    value={typeof totalMinionAmount === "number" ? totalMinionAmount : 11}
                                    onChange={(event, newValue) => handleSliderChange(newValue, "totalMinionAmount")}
                                    valueLabelDisplay="auto"
                                    min={3}
                                    max={30}
                                    marks
                                    step={1}
                                    getAriaValueText={(v) => `${v} Minions`}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={totalMinionAmount}
                                    margin="dense"
                                    onChange={(event, newValue) => handleSliderChange(newValue, "totalMinionAmount")}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: 10,
                                        min: 3,
                                        max: 30,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">Max Minions per Turn</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={6}>
                                <Slider
                                    value={typeof maxTake === "number" ? maxTake : 3}
                                    onChange={(event, newValue) => handleSliderChange(newValue, "maxTake")}
                                    valueLabelDisplay="auto"
                                    min={1}
                                    max={10}
                                    marks
                                    step={1}
                                    getAriaValueText={(v) => `${v} Minions`}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={maxTake}
                                    margin="dense"
                                    onChange={(event, newValue) => handleSliderChange(newValue, "maxTake")}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: 10,
                                        min: 1,
                                        max: 10,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}


export default connect(
    state => {
        return {
            hardMode: state.settings.hardMode,
            totalMinionAmount: state.settings.totalMinionAmount,
            startOption: state.settings.startOption,
            maxTake: state.settings.maxTake
        }
    }, dispatch => {
        return {
            setSettings: (settingName, settingValue) => dispatch(changeSettings(settingName, settingValue))
        }
    })(Settings)

