/**
 * Redux Toolkit store assembly.
 *
 * `makeStore` builds a fresh store per request (SSR-safe) and hydrates the
 * persisted slices on the client. Exports the typed `RootState`, `AppStore`,
 * and `AppDispatch` used throughout the app.
 */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import playerReducer from "./slices/playerSlice";
import continueWatchingReducer from "./slices/continueWatchingSlice";
import uiReducer from "./slices/uiSlice";
import searchReducer from "./slices/searchSlice";
import { contentfulRestApi } from "./api/contentfulRestApi";
import { contentfulGqlApi } from "./api/contentfulGqlApi";
import {
  localStorageMiddleware,
  type PersistedState,
} from "./middleware/localStorageMiddleware";

const rootReducer = combineReducers({
  user: userReducer,
  player: playerReducer,
  continueWatching: continueWatchingReducer,
  ui: uiReducer,
  search: searchReducer,
  [contentfulRestApi.reducerPath]: contentfulRestApi.reducer,
  [contentfulGqlApi.reducerPath]: contentfulGqlApi.reducer,
});

/** Build a store instance, optionally hydrated with persisted slices. */
export function makeStore(preloadedState?: PersistedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        contentfulRestApi.middleware,
        contentfulGqlApi.middleware,
        localStorageMiddleware,
      ),
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
