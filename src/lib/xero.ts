import { XeroClient } from 'xero-node';

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || ''],
  scopes: 'offline_access openid profile email accounting.transactions accounting.settings accounting.contacts.read accounting.contacts accounting.settings.read'.split(' '),
});

export { xero };
