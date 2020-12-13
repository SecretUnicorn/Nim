import store from "redux/store"
import _ from "loadsh"
class GameLogic{
    aiMove(){
        const state = store.getState()
        const hardMode = state.settings.hardMode
        const rightMinions = state.game.amount_right
        const leftMinions = state.game.amount_left
        let amount = 1
        const maxTake = state.settings.maxTake
        let takeFromLeft = true

        if(!hardMode) {
            if(leftMinions > 0 && rightMinions > 0) {
                takeFromLeft = _.take([true, false])
            } else {
                takeFromLeft = leftMinions > 0 
            }
            if(takeFromLeft) {
                amount = _.random(1, Math.min(leftMinions, maxTake))
            } else {
                amount = _.random(1, Math.min(rightMinions, maxTake))
            }
            
            return {
                side: takeFromLeft ? 'left' : 'right',
                amount
            }
        }



        if (rightMinions === 0 && leftMinions <=maxTake){
            amount = leftMinions;
            takeFromLeft = true;
        }
        else if (leftMinions === 0 && rightMinions <=maxTake){
            amount = rightMinions;
            takeFromLeft = false;
        }
        
        //-> strategy (3)
        //is it possible to bring both takeFromLefts down to only one minion (= MOM pattern) 
        else if (rightMinions === 1 && leftMinions !== 0){
            takeFromLeft = true;
            //creating M O M pattern if possible
            if (leftMinions <= (maxTake+1) && leftMinions > 1){
                amount = leftMinions -1;
            }
            //bringing it down to 5 minions so the user cannot create the M O M pattern
            else if (leftMinions > (maxTake+1) && leftMinions <= (2*maxTake+1)){
                amount = leftMinions - (maxTake+2);
            }
            //Worst case scenario -> user will probably win
            //Hope that user will amount all remaining minions
            else if (leftMinions === (maxTake+2)){
                amount = rightMinions - maxTake;
            }
        }
        else if (leftMinions === 1 && rightMinions !== 0){
            takeFromLeft = false;
            //Creating the M O M pattern if possible
            if (rightMinions <=(maxTake+1) && rightMinions > 1){
                amount = rightMinions -1;	
            }
            //bringing it down to 5 minions so the user cannot create the M O M pattern
            else if (rightMinions > (maxTake+2) && rightMinions <= (2*maxTake+1)){
                amount = rightMinions - (maxTake+2);
            }
            //Worst case scenario -> user will probably win
            //Hope that user will amount all remaining minions
            else if (rightMinions === (maxTake+2)){
                amount = rightMinions - maxTake;
            }
        }
        // END-MOM-PATTERN
        
        //-> strategy (1)
        //If there is more than 4 but less than 8: Computer brings down the amount of minions on one takeFromLeft to 4 
        
        // bring it down to 4 minions BUT only if the opponent doesn't have the chance 
        // more specific: he can bring the other takeFromLeft down to zero OR the other takeFromLeft is already zero
        else if (leftMinions > (maxTake+1) && leftMinions <= (2*maxTake+1) && (rightMinions > maxTake || rightMinions === 0)){
            amount = leftMinions -(maxTake+1);
            takeFromLeft = true;
        }
        else if (rightMinions > (maxTake+1) && rightMinions <= (2*maxTake+1) && (leftMinions > maxTake || leftMinions === 0)){
            amount = rightMinions -(maxTake+1);
            takeFromLeft = false;
        }
        //If there is already a 4 minion pattern on one takeFromLeft clear the other one
        else if (rightMinions <= maxTake && leftMinions !== 0 &&  leftMinions % (maxTake+1) === 0){
            amount = rightMinions;
            takeFromLeft = false;
        }
        else if (leftMinions <= maxTake && leftMinions !== 0 && rightMinions % (maxTake+1) === 0 ){
            amount = leftMinions;
            takeFromLeft = true;
        }
        
        
        //If none of the strategies apply just amount one
        //OR if the bot is trapped in the strategy of the user just amount one
        else {
            //if taking away 1 from the right would create a 4 minion pattern BUT with remaining minions on the other takeFromLeft
            //don't do it and choose the other takeFromLeft
            if (rightMinions-1 === (maxTake+1) && leftMinions < (maxTake+1) && leftMinions > 1){
                takeFromLeft = true;
            }
            //see above but applied on the other takeFromLeft
            else if (leftMinions-1 === (maxTake+1) && rightMinions < (maxTake+1) && rightMinions > 1){
                takeFromLeft = false;
            }
            //else: just amount from the bigger takeFromLeft
            else{
                if (leftMinions < rightMinions){
                    takeFromLeft = false;
                }
                else {
                    takeFromLeft = true;
                }
            }	
        }

        return {
            side: takeFromLeft ? 'left' : 'right',
            amount
        }

    }
    checkGameOver() {
        const state = store.getState()
        const {amount_left, amount_right} = state.game
        return (amount_left === 0 && amount_right === 0) || (amount_left < 0 && amount_right === 1) || (amount_right < 0 && amount_left === 1)
    }
}

const instance = new GameLogic()
Object.freeze(instance)
export default instance