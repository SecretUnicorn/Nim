import { createStore, compose, applyMiddleware } from 'redux'
import rootReducer from 'redux/reducer'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
	const { logger } = require(`redux-logger`);

	middlewares.push(logger);
}


const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(...middlewares))
	//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store