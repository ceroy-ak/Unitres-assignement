import { createStore } from "redux";

export interface UserState {
  name: string;
  email: string;
}

export const initialState: UserState = {
  name: "",
  email: "",
};

export const SET_USER = "SET_USER";

interface SetUserAction {
  type: typeof SET_USER;
  payload: UserState;
}

export type UserActionTypes = SetUserAction;

export const setUser = (name: string, email: string): UserActionTypes => ({
  type: SET_USER,
  payload: { name, email },
});

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
      };
    default:
      return state;
  }
};

const store = createStore(userReducer);

export default store;
