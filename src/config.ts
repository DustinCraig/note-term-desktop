interface Config {
  apiBaseUrl: string;
  isDevelopment: boolean;
}

const config: Config = {
  apiBaseUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000",
  isDevelopment: process.env.NODE_ENV === "development",
};

export default config;
