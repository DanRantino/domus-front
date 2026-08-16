import { LogtoProvider, type LogtoConfig } from "@logto/react";

const config: LogtoConfig = {
  endpoint: "http://localhost:3001/",
  appId: "tv0uj56nf3nzf8h4499mb",
};

const App = () => (
  <LogtoProvider config={config}>{/* <YourAppContent /> */}</LogtoProvider>
);
