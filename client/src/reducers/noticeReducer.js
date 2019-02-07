import { SET_NOTICE, NOTICE_LOADING, CLEAR_NOTICE } from "../actions/types";

const initialState = { loading: false };

export default function(state = initialState, action) {
  switch (action.type) {
    case NOTICE_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_NOTICE:
      return action.payload;
    case CLEAR_NOTICE:
      return {};
    default:
      return state;
  }
}
