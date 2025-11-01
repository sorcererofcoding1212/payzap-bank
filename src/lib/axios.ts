import axios from "axios";
import { BANK_WEBHOOK_URL } from "@/config/config";

export const bankWebhookInstance = axios.create({
  baseURL: BANK_WEBHOOK_URL,
});
