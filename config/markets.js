export const markets = {
  gambia: {
    baseURL: 'https://chopwin.gm/',
    phone: process.env.GAMBIA_PHONE,
    password: process.env.GAMBIA_PASSWORD,
    depositMethod: 'Wave Wave',
    withdrawalMethod: 'Wave Wave',
    withdrawalAmount: '20',
    depositAmount: '20',
  },

  uganda: {
    baseURL: 'https://www.chopwin.ug/',
    phone: process.env.UGANDA_PHONE,
    password: process.env.UGANDA_PASSWORD,
    depositMethod: 'MTN MTN',
    withdrawalMethod: 'MTN MTN',
    withdrawalAmount: '1,000',
    depositAmount: '500',
  },

  sierraLeone: {
    baseURL: 'https://www.chopwin.sl/',
    phone: process.env.SIERRA_LEONE_PHONE,
    password: process.env.SIERRA_LEONE_PASSWORD,
    depositMethod: 'Orange Money',
    withdrawalMethod: 'Orange Money',
  },
};