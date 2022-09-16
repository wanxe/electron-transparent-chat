import { ref } from 'vue';
import axios, { AxiosRequestHeaders } from 'axios';
import { Poll } from './../helpers';

const TW_STREAMER_NAME = import.meta.env.VITE_TW_USERNAME;
const TW_CLIENT_ID = import.meta.env.VITE_TW_CLIENT_ID;
const TW_CLIENT_SECRET = import.meta.env.VITE_TW_CLIENT_SECRET;

export function useOnlineCheck () {
  const isOnline = ref(false);

  const getStatus = async () => {
    let poll: Poll | null = null;
    const body = {
      'client_id': TW_CLIENT_ID,
      'client_secret': TW_CLIENT_SECRET,
      "grant_type": 'client_credentials',
    };
    try {
      const { data: authData } = await axios.post('https://id.twitch.tv/oauth2/token', body);
      const getIsOnline = async () => {
        const headers: AxiosRequestHeaders = {
          'Client-ID': TW_CLIENT_ID,
          'Authorization': 'Bearer ' + authData.access_token,
        };
        const { data: loginResponse } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${TW_STREAMER_NAME}`, { headers });
        isOnline.value = loginResponse.data?.length < 0;
        // eslint-disable-next-line no-console
        console.log('checking if is online: ',isOnline.value );
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
      // eslint-disable-next-line no-console
      console.log('[useOnlineCheck error]: ', error);
    }
  };

  return {
    getStatus,
    isOnline,
  };
}