import axios from 'axios';
import qs from 'qs';

/**
 * Function: getAccessToken
 * Purpose: Fetches an access token from MangaDex authentication API.
 */
export async function getAccessToken(): Promise<string> {
  const creds = {
    grant_type: 'password',
    username: process.env.MANGADEX_USERNAME as string,
    password: process.env.MANGADEX_PASSWORD as string,
    client_id: process.env.MANGADEX_CLIENT_ID as string,
    client_secret: process.env.MANGADEX_CLIENT_SECRET as string,
  };

  try {
    const response = await axios.post<{ access_token: string }>(
      'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token',
      qs.stringify(creds),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const token: string = response.data.access_token;
    console.log('Access token obtained:', token ? token.slice(0, 20) + '...' : 'No token');
    return token;
  } catch (error: any) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get access token');
  }
}
