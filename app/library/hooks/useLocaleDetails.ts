import { useContext } from "react";
import { LocaleContext } from "../context/Locale";

const useLocaleDetails = () => {
  const { activeLocaleDetails } = useContext(LocaleContext);
  return activeLocaleDetails;
};
export default useLocaleDetails;
