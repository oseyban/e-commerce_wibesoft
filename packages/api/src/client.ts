import type { Config } from "./generated/client";
import { client as generatedClient } from "./generated/client.gen";

export const client = generatedClient;

export const configureClient = (config: Config) => {
  client.setConfig(config);
};

export const setApiBaseUrl = (baseUrl: string) => {
  if (!baseUrl) return;
  client.setConfig({ baseUrl });
};