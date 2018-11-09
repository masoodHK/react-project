const reducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return { ...state, user: action.user };
    case "UPDATE_USER":
      return { ...state, user: action.user };
    case "REMOVE_USER":
      return { ...state, user: null };
    default:
      return state;
  }
};

export default reducer;
