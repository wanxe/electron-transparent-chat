import axios, { AxiosRequestHeaders } from 'axios';
import { Poll } from './../helpers';
import { useStore } from '../store/appStore';

const TW_STREAMER_NAME = import.meta.env.VITE_TW_USERNAME;
const TW_CLIENT_ID = import.meta.env.VITE_TW_CLIENT_ID;
const TW_CLIENT_SECRET = import.meta.env.VITE_TW_CLIENT_SECRET;
// const TW_API_SCOPES = ['channel:manage:redemptions', 'user:edit:follows'];

export function useOnlineCheck () {
  const store = useStore();

  let poll: Poll | null = null;

  const getAuthToken = async (): Promise<string> => {
    const body = {
      'client_id': TW_CLIENT_ID,
      'client_secret': TW_CLIENT_SECRET,
      'grant_type': 'client_credentials',
    };
    try {
      const { data: authData } = await axios.post('https://id.twitch.tv/oauth2/token', body);
      store.authToken = authData.access_token;

      return store.authToken;
    } catch (error) {
      if (poll) {
        poll.stop();
      }
      console.log('[useOnlineCheck error]: ', error);
    }
  };

  const startPolling = async (authToken: string): Promise<void> => {
    try {
      const getIsOnline = async () => {
        const headers: AxiosRequestHeaders = {
          'Client-ID': TW_CLIENT_ID,
          'Authorization': 'Bearer ' + authToken,
        };
        const { data: loginResponse } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${TW_STREAMER_NAME}`, { headers });
        console.log('checking if is online: ', loginResponse);

        store.isOnline = loginResponse.data?.length > 0;
      };

      poll = new Poll({
        maxAttempts: 0, // infinite
        sleepTime: 60000, // one minute
      }, getIsOnline);

      await poll.start();
    } catch (error) {
      if (poll) {
        poll.stop();
      }
      console.log('[getIsOnline polling error]: ',error);
    }
  };

  return {
    getAuthToken,
    startPolling,
  };
}