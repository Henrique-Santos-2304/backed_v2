export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_SECRET: string;
      DATABASE_URL: string;
      ENV: "test" | "dev" | "prod" | "prod-dev";
      ONE_SIGNAL_API_KEY: string;
      ONE_SIGNAL_APP_ID: string;
      AWS_MQTT_HOST: string;
      AWS_KEY_PATH: string;
      AWS_CERT_PATH: string;
      AWS_CA_PATH: string;
      AWS_CLIENT_ID: string;
      TOPICS: string;
      FARM_ID: string;
    }
  }
}
