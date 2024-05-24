function Show({ if: condition, show, else: elseif, children }) {
  const executeOrReturn = (possibleFunc) => (typeof possibleFunc === 'function' ? possibleFunc() : possibleFunc);

  if (condition) {
    return children || executeOrReturn(show);
  } else if (elseif) {
    return executeOrReturn(elseif);
  }

  return null;
}

export default Show;
