// import login from "../constants";
import { SET_CURRENT_USER } from "../actions/type";
import isEmpty from "../validation/is-empty";
// import login from "../actions";

const initiialState = {
  isAuthenticated: false,
  user: {}
};

const authReducer = (state = initiialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      // state = {user: action.payload}
      return Object.assign({}, state, {
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      });
    default:
      return state;
  }
};

export default authReducer;
