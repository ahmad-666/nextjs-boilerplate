// const [name, setName] = useState("");
// const { value, copyToClipboard, success, setSuccess } = useClipboard();
// <input value={name} onChange={(e) => setName(e.target.value)} />
// <button onClick={() => {
//     copyToClipboard(name);
//     setTimeout(() => {setSuccess("");}, 2000);
//     }}
// >copy</button>
// {value && <h1>clipboard:{value}</h1>}  {success && <h1>success:{success}</h1>}

import { useCallback, useState } from "react";

const useClipboard = () => {
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<unknown>("");
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("successfully copy to clipboard");
      setError("");
      setValue(text);
    } catch (err) {
      setSuccess("");
      setError(err);
      setValue("");
    }
  }, []);
  return {
    value,
    setValue,
    success,
    setSuccess,
    error,
    setError,
    copyToClipboard,
  };
};
export default useClipboard;
