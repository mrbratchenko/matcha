import { SET_CURRENT_USER, SET_CURRENT_USER_AVATAR } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_CURRENT_USER_AVATAR:
      return {
        ...state,
        user: { ...state.user, avatar: action.payload }
      };
    default:
      return state;
  }
}
