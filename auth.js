const axios = require('axios');
const express = require('express');
const router = express.Router();

// 스마트앱 정보
const clientId = '737638b7-2007-4550-8242-b95ea570c125';
const clientSecret = '74ac395f-cb14-4390-afe0-2c3fd0a0dff1';
const redirectUri = 'https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/oauth/callback'; // 콜백 URL

// 스마트싱스 OAuth 2.0 인증 엔드포인트 및 토큰 엔드포인트
const authorizationUrl = 'https://api.smartthings.com/oauth/authorize';
const tokenUrl = 'https://api.smartthings.com/oauth/token';

// 사용자의 스마트싱스 계정으로 로그인하는 페이지
router.get('/login', (req, res) => {
  const authParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'app',
  };
  const authUrl = `${authorizationUrl}?${new URLSearchParams(authParams)}`;
  console.log(authUrl);
  res.redirect(authUrl);
});

// 스마트싱스에서 리디렉션하고 인증 코드를 수신하는 콜백 핸들러
router.get('/callback', async (req, res) => {
    console.log('callback');
    const code = req.query.code;

    // 인증 코드를 사용하여 액세스 토큰을 요청
    const tokenParams = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code: code,
    };

    try {
    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenParams));
    const accessToken = tokenResponse.data.access_token;
    res.send(`Access Token: ${accessToken}`);
    } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Error getting access token');
    }
});

module.exports = router;