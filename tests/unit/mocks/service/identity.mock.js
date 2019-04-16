import identityService from '@/service/identity';

jest.mock('@/service/identity', () => {
  const {
    successResponse,
    getRecoveryIdentifierResponse,
  } = require('@unitFixtures/services/identity');

  return {
    getSettings: jest.fn(),
    getOtpSettings: jest.fn(),
    getAccount: jest.fn(),
    getAccounts: jest.fn(),
    getAccountInfo: jest.fn(),
    getAuthStatus: jest.fn(),
    auth: jest.fn(),
    authWithGoogle: jest.fn(),
    authWithGitHub: jest.fn(),
    otpAuth: jest.fn(),
    logout: jest.fn(),
    awaitLogoutConfirm: jest.fn(),
    awaitAccountCreate: jest.fn(),
    getRecoveryIdentifier: jest
      .fn()
      .mockResolvedValue(getRecoveryIdentifierResponse.message),
    recover: jest.fn().mockResolvedValue(successResponse),
    getAuthPermission: jest.fn(),
    setAuthPermission: jest.fn(),
    awaitAuthConfirm: jest.fn(),
  };
});

export default identityService;
