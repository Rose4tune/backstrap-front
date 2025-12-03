import React from "react";
import axios, { AxiosRequestConfig } from "axios";

export type State<I, O> = {
  readonly data?: I | null;

  readonly result?: O | null;

  readonly error?: any | null;

  readonly loading?: boolean | null;
};

const ACTION_REQUEST_START = "REQUEST_START";
const ACTION_REQUEST_SUCCESS = "REQUEST_SUCCESS";
const ACTION_REQUEST_FAILURE = "REQUEST_FAILURE";

type Action<I, O> = {
  readonly type:
    | typeof ACTION_REQUEST_START
    | typeof ACTION_REQUEST_SUCCESS
    | typeof ACTION_REQUEST_FAILURE;

  readonly payload: I | O | any;
};

type Reducer<I, O> = React.Reducer<State<I, O>, Action<I, O>>;

export default function useHttpPost<I, O>(
  url: string,
  config?: Pick<AxiosRequestConfig, "headers">
): [State<I, O>, (data: I) => void] {
  const reducer: Reducer<I, O> = (state, action) => {
    switch (action.type) {
      case ACTION_REQUEST_START:
        return {
          ...state,
          loading: true,
          data: action.payload,
          result: null,
          error: null,
        };
      case ACTION_REQUEST_SUCCESS:
        return {
          ...state,
          loading: false,
          result: action.payload,
          data: null,
          error: null,
        };
      case ACTION_REQUEST_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
          data: null,
          result: null,
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    loading: false,
    data: null,
    result: null,
    error: null,
  });

  React.useEffect(() => {
    if (state.data != null) {
      axios
        .post<O>(url, state.data, config)
        .then((result) => {
          dispatch({
            type: ACTION_REQUEST_SUCCESS,
            payload: result.data,
          });
        })
        .catch((error) => {
          dispatch({
            type: ACTION_REQUEST_FAILURE,
            payload: error?.response?.data?.error,
          });
        });
    }
  }, [state]);

  return [
    state,
    (data) => {
      dispatch({ type: ACTION_REQUEST_START, payload: data });
    },
  ];
}
