import { defineStore } from 'pinia';
// import { useChatChannelRedemptions } from '../composables/useChatChannelRedemptions';
import { useChatClient } from '../composables/useChatClient';
import { useOnlineCheck } from '../composables/useOnlineCheck';
import { TwitchMessage } from '../typings/types';

export const useStore = defineStore('main', {
  state: () => {
    return {
      isOnline: undefined,
      authToken: undefined,
      chatMessages: [],
    };
  },
  actions: {
    async init () {
      const { messages } = useChatClient();
      this.chatMessages = messages as TwitchMessage[];
      const onlineCheck = useOnlineCheck();
      const authToken = await onlineCheck.getAuthToken();
      onlineCheck.startPolling(authToken);
      // const redemptions = useChatChannelRedemptions();
      // await redemptions.init(authToken);
      // console.log('redemptions: ', redemptions.redemptionData);
    },
  },
});
