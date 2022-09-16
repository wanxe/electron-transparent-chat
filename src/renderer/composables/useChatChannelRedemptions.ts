/* eslint-disable no-console */
import axios from 'axios';
import { reactive } from 'vue';

// credits: https://raw.githubusercontent.com/twitchdev/channel-points-node-sample/main/index.js

const customRewardBody = {
  title: "Sample: Follow me!",
  prompt: "Follows the requesting user!",
  cost: 10 * 1000 * 1000,
  is_enabled: true,
  is_global_cooldown_enabled: true,
  global_cooldown_seconds: 10 * 60,
};


let clientId = '';
let userId = '';
let headers = {};
let rewardId = '';
let pollingInterval = undefined;

// validates the provided token and validates the token has the correct scope(s). additionally, uses the response to pull the correct client_id and broadcaster_id
const validateToken = async (token: string) => {
  let r;
  try {
    const { data: response } = await axios.get(`https://id.twitch.tv/oauth2/validate`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    r = response;
    console.log('r: ', response);
  } catch (error) {
    console.log('[error]: Invalid token. Please get a new token using twitch token -u -s "channel:manage:redemptions user:edit:follows"');
    return false;
  }

  if(r.scopes.indexOf("channel:manage:redemptions") == -1 || r.scopes.indexOf("user:edit:follows") == -1 || !r?.user_id){
    console.log('Invalid scopes. Please get a new token using twitch token -u -s "channel:manage:redemptions user:edit:follows"');

    return false;
  }

  // update the global variables to returned values
  clientId = r.client_id;
  userId = r.user_id;
  headers = {
    "Authorization": `Bearer ${token}`,
    "Client-ID": clientId,
    "Content-Type": "application/json",
  };

  return true;
};

// returns an object containing the custom rewards, or if an error, null
const getCustomRewards = async () => {
  try {
    const { data: response } = await axios(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userId}`, { headers: headers });
    return JSON.parse(response).data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// if the custom reward doesn't exist, creates it. returns true if successful, false if not
const addCustomReward = async () => {
  try {
    const { data: response } = await axios.post(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userId}`, {
      headers: headers,
      body: JSON.stringify(customRewardBody),
      responseType: 'json',
    });

    rewardId = response.data[0].id;

    return true;
  } catch (error) {
    console.log("Failed to add the reward. Please try again.");
    return false;
  }
};

// Follows from the user (fromUser) to another user (toUser). Returns true on success, false on failure
const followUser = async (fromUser: string, toUser: string) => {
  try {
    await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${fromUser}&to_id=${toUser}`, { headers: headers });
    return true;
  } catch (error) {
    console.log(`Unable to follow user ${toUser}`);
    return false;
  }
};

const fulfillRewards = async (ids: string[], status: string) => {
  // if empty, just cancel
  if (ids.length == 0) {
    return;
  }

  // transforms the list of ids to ids=id for the API call
  ids = ids.map(v => `id=${v}`);

  try {
    await axios.patch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${userId}&reward_id=${rewardId}&${ids.join("&")}`, {
      headers,
      json: {
        status,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export function useChatChannelRedemptions () {
  // function for polling every 15 seconds to check for user redemptions
  const redemptionData = reactive({
    redemptions: null,
    successfulRedemptions: [],
    failedRedemptions: [],
  });
  const pollForRedemptions = async () => {
    try {
      const { data: response } = await axios(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${userId}&reward_id=${rewardId}&status=UNFULFILLED`, {
        headers: headers,
        responseType: 'json',
      });

      redemptionData.failedRedemptions = response.data;

      for (const redemption of redemptionData.redemptions) {
      // can't follow yourself :)
        if (redemption.broadcaster_id == redemption.user_id) {
          redemptionData.failedRedemptions.push(redemption.id);
          continue;
        }
        // if failed, add to the failed redemptions
        if (await followUser(redemption.broadcaster_id, redemption.user_id) == false) {
          redemptionData.failedRedemptions.push(redemption.id);
          continue;
        }
        // otherwise, add to the successful redemption list
        redemptionData.successfulRedemptions.push(redemption.id);
      }

      // do this in parallel
      await Promise.all([
        fulfillRewards(redemptionData.successfulRedemptions, "FULFILLED"),
        fulfillRewards(redemptionData.failedRedemptions, "CANCELED"),
      ]);

      console.log(`Processed ${redemptionData.successfulRedemptions.length + redemptionData.failedRedemptions.length} redemptions.`);

      // instead of an interval, we wait 15 seconds between completion and the next call
      pollingInterval = setTimeout(pollForRedemptions, 15 * 1000);
    } catch (error) {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      console.log("Unable to fetch redemptions.");
    }
  };

  // main function - sets up the reward and sets the interval for polling
  const init = async (token: string) => {
    if (await validateToken(token) === false) {
      return;
    }

    const rewards = await getCustomRewards();
    if (rewards !== null) {
      rewards.forEach(v => {
      // since the title is enforced as unique, it will be a good identifier to use to get the right ID on cold-boot
        if (v.title == customRewardBody.title) {
          rewardId = v.id;
        }
      });
    }else{
      console.log("The streamer does not have access to Channel Points. They need to be a Twitch Affiliate or Partner.");
    }
    // if the reward isn't set up, add it
    if (rewardId === '' && await addCustomReward() === false) {
      return;
    }

    pollForRedemptions();
  };

  return {
    init,
    redemptionData,
  };
}
