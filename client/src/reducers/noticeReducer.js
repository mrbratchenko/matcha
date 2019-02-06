import { GET_NOTICE } from "../actions/types";

const initialState = "";

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NOTICE:
      return action.payload;
    default:
      return state;
  }
}
