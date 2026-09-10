import { fetchEventSource } from '@microsoft/fetch-event-source';
import { supabase } from '../lib';

export type SseEventHandler<TDataMap extends Record<string, unknown>> = {
  [K in keyof TDataMap]: (data: TDataMap[K]) => void;
};
export const createSseConnection = <TDataMap extends Record<string, unknown>>(
  url: string,
  handlers: SseEventHandler<TDataMap>,
  onError?: (err: unknown) => void
) => {
  const controller = new AbortController();

  const startListening = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session?.data.session?.access_token;

      const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

      await fetchEventSource(fullUrl, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "X-API-KEY": import.meta.env.VITE_BACKEND_API_KEY,
        },
        signal: controller.signal,
        onopen: async (response) => {
          if (!response.ok) {
            throw new Error(`SSE connection failed with status: ${response.status}`);
          }
        },
        onmessage(msg) {
          if (!msg.event || !msg.data) return;

          const eventName = msg.event as keyof TDataMap;
          const handler = handlers[eventName];

          if (!handler) return;

          try {
            const parsedData = JSON.parse(msg.data) as TDataMap[typeof eventName];
            handler(parsedData);
          } catch (e) {
            console.error(`Failed to parse SSE message for event [String(eventName)}]:`, e);
          }
        },
        onerror(err) {
          onError?.(err);
          throw err;
        },
      });
    } catch (error) {
      console.error("SSE connection error:", error);
    }
  };

  startListening();

  return () => {
    controller.abort();
  };
};