import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

const initialState = {};
const middleware = applyMiddleware(thunk);

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(middleware)
);

export default store;
