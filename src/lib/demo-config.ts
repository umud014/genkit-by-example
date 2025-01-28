import { createContext } from "react";

const DemoConfig = createContext<{
  config?: Record<string, any>;
  setConfig?: (newConfig: Record<string, any>) => void;
}>({});
export default DemoConfig;
