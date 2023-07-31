import axios from 'axios'
import oauth from 'axios-oauth-client'

let accessToken: string = '';

export function setAccessToken(token: string) {
    accessToken = token;
}

export const API = axios.create({
  baseURL:
    "https://2c6c3c6e-fa65-4e8d-8943-215214887ec8-dev.e1-us-east-azure.choreoapis.dev/vpfg/yasithavisitapi/visit-420/1.0.0",
});
