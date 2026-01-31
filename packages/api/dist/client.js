import { client as generatedClient } from "./generated/client.gen";
export const client = generatedClient;
export const configureClient = (config) => {
    client.setConfig(config);
};
export const setApiBaseUrl = (baseUrl) => {
    if (!baseUrl)
        return;
    client.setConfig({ baseUrl });
};
