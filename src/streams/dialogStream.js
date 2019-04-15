import store from '@/store';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import {
  accountChannel,
  authChannel,
  signChannel,
} from '@/class/singleton/channels';
import { METHODS } from '@/constants';
import Queue from './Queue';
import middleware from './middleware';
import { applyDialogResizeStream } from './dialogResize';

export function applyDialogStream() {
  applyDialogResizeStream();

  const queueInst = new Queue({ middleware });

  const methodToOptions = {
    [METHODS.SIGN]: {
      commit(payload) {
        store.commit('setRequest', payload);
      },
      routeName: 'sign',
      channel: signChannel,
      needAuth: true,
      needPermission: true,
    },
    [METHODS.AUTH]: {
      commit(payload) {
        store.commit('setAuthParams', payload);
      },
      channel: authChannel,
      needAuth: true,
      needPermission: true,
    },
    [METHODS.ACCOUNT]: {
      routeName: 'account',
      channel: accountChannel,
      needAuth: true,
      needPermission: true,
      async beforeShow() {
        await Promise.all([
          store.dispatch('defineOnlyV3Accounts'),
          store.dispatch('defineSettings'),
        ]);
      },
    },
    [METHODS.GET_SETTINGS]: {
      needPermission: true,
      async payloadHandler() {
        await store.dispatch('defineSettings');
        const { settings } = store.state.accounts;
        return { settings };
      },
    },
    [METHODS.RECOVER]: {
      needPermission: true,
      payloadHandler(payload) {
        return store.dispatch('recoverMessage', payload);
      },
    },
    [METHODS.LOGOUT]: {
      payloadHandler() {
        return store.dispatch('logout');
      },
    },
  };

  bridgeMessenger.subscribe(async (payload, req) => {
    // routing by methods
    const { method } = req;

    const options = methodToOptions[method] || {};

    queueInst.handleRequest(options, payload, req);
  });
}
