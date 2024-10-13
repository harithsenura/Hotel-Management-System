// src/store.js

import { createStore, applyMiddleware, combineReducers } from "redux"; // Import necessary Redux functions
import { thunk } from "redux-thunk"; // Correct import for redux-thunk
import { composeWithDevTools } from "@redux-devtools/extension"; // Correct import for redux-devtools-extension
import { rootReducer } from "./rootReducer"; // Import your rootReducer

// Initialize cartItems from localStorage
const cartItemsFromStorage = JSON.parse(localStorage.getItem("cartItems")) || [];

// Define the initial state
const initialState = {
  loading: true,
  cartItems: cartItemsFromStorage,
};

// Apply middleware
const middleware = [thunk];

// Combine reducers if you have more reducers
const combinedReducers = combineReducers({
  rootReducer,
  // You can add other reducers here if you have more
});

// Create the Redux store
const store = createStore(
  combinedReducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // Enable Redux DevTools
);

export default store;
