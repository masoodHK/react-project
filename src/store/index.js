import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage
  },
  reducers
);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persist = persistStore(store);

export { store, persist };
