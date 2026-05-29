import { useState } from "react";

function useToggle(initialState = false): [boolean, () => void] {
  const [state, setState] = useState(initialState);

  function toggle() {
    setState((s) => !s);
  }

  return [state, toggle];
}

export default useToggle;
