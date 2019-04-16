import 'jest-localstorage-mock';

import './mocks/service/identity.mock';
import './mocks/service/settings.mock';
import './mocks/util/core-class';
import './mocks/service/Signer/web3.mock';
import './mocks/service/Signer/Wallet.mock';
import './mocks/github-oauth-popup.mock';
import './mocks/bip39.mock';
import './mocks/ethereumjs-wallet/hdkey.mock';
import './mocks/router.mock';
import './mocks/web3.mock';

global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
