const axios = require('axios');
const express = require('express');
const router = express.Router();
const { generateRandomState, saveState, getState } = require('./state');

// // 스마트앱 정보
// const clientId = '737638b7-2007-4550-8242-b95ea570c125';
// const clientSecret = '74ac395f-cb14-4390-afe0-2c3fd0a0dff1';

// cli id
const clientId = '0620ce9a-fe0b-4922-84b3-a0f2e1a9225a';
const clientSecret = '5738a2fa-a3e9-4531-8aa9-4615fa5db637';

const redirectUri = 'https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/oauth/callback'; // 콜백 URL

// 스마트싱스 OAuth 2.0 인증 엔드포인트 및 토큰 엔드포인트
const authorizationUrl = 'https://api.smartthings.com/oauth/authorize';
const tokenUrl = 'https://auth-global.api.smartthings.com/oauth/token';

const deviceScope = 'r:locations:* r:devices:* w:devices:* r:scenes:* x:locations:* x:scenes:* r:hubs:* w:devices:$ w:rules:* r:rules:* w:locations:* x:devices:* r:installedapps w:installedapps x:devices:$ r:devices:$';

// 사용자의 스마트싱스 계정으로 로그인하는 페이지
router.get('/login', (req, res) => {
  const authParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code'
  };
  const authUrl = `${authorizationUrl}?${new URLSearchParams(authParams)}`;
  console.log(authUrl);
  res.redirect(authUrl);
});

// 스마트싱스에서 리디렉션하고 인증 코드를 수신하는 콜백 핸들러
router.get('/callback', async (req, res) => {
    console.log(req.query);
    const code = req.query.code;

    const state = generateRandomState();
    saveState(state);

    // 인증 코드를 사용하여 액세스 토큰을 요청
    const tokenParams = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
      state: state
    };

    try {
      const tokenResponse = await axios.post(`${tokenUrl}?${new URLSearchParams(tokenParams)}`, tokenParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      // 토큰을 성공적으로 받았을 때 "state" 값을 확인
      const receivedState = req.query.state;
      console.log(req.query);
      console.log(receivedState);
      console.log(getState());
      if (getState()[receivedState]) {
        // "state" 값이 유효하면 토큰을 반환
        const accessToken = tokenResponse.data.access_token;
        res.send(tokenResponse.data);
      } else {
        // "state" 값이 유효하지 않으면 에러 처리
        console.error('Invalid state value.');
        res.status(400).send('Invalid state value.');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
      res.status(500).send('Error getting access token');
    }
});

module.exports = router;

// scope: [
//   "r:devices:$",
//   "r:devices:*",
//   "r:hubs:*",
//   "r:installedapps",
//   "r:locations:*",
//   "r:rules:*",
//   "r:scenes:*",
//   "w:devices:$",
//   "w:devices:*",
//   "w:installedapps",
//   "w:locations:*",
//   "w:rules:*",
//   "x:devices:$",
//   "x:devices:*",
//   "x:locations:*",
//   "x:scenes:*"
// ]