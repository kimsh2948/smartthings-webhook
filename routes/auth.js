const axios = require('axios');
const express = require('express');
const session = require('express-session');
const router = express.Router();
const fs = require('fs');

// // 스마트앱 정보
// const clientId = '737638b7-2007-4550-8242-b95ea570c125';
// const clientSecret = '74ac395f-cb14-4390-afe0-2c3fd0a0dff1';

// //cli id
// const clientId = '0620ce9a-fe0b-4922-84b3-a0f2e1a9225a';
// const clientSecret = '5738a2fa-a3e9-4531-8aa9-4615fa5db637';

// new cli id
const clientId = 'fa7e64cd-f02d-4c4f-882d-9fe9e9d1f4cf';
const clientSecret = '34ccaf7d-c11f-4595-bb82-0d60abad5a7c';

const redirectUri = 'https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/oauth/callback'; // 콜백 URL

// 스마트싱스 OAuth 2.0 인증 엔드포인트 및 토큰 엔드포인트
const authorizationUrl = 'https://api.smartthings.com/oauth/authorize';
const tokenUrl = 'https://api.smartthings.com/oauth/token';

const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

const checkAuth = (req, res, next) => {
  if (req.session && req.session.accessToken) {
    next(); 
  } else {
      refreshAccessToken(req, res);
      next();
  }
}

const refreshAccessToken = async (req, res) => {
  try {
      const tokenData = JSON.parse(fs.readFileSync('secret.json'));
      const { refreshToken } = tokenData;

      const tokenParams = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        clientId: clientId
      };

      const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenParams), {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        console.log(response.data);
        req.session.accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        fs.writeFileSync('secret.json', JSON.stringify({ refreshToken }));
      })
  } catch (err) {
      console.error(err);
  }
}

router.get('/refresh', (req, res) => {
  refreshAccessToken(req, res);
  res.send('success');
})

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

// aws bridge 백엔드로 인증코드 전송
router.get('/callback', async (req, res) => {
  console.log(req.query);
  const code = req.query.code;

  await axios.get('https://smartthings.ami-konai.com/oauth/code', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    console.log(res.data);
    res.redirect('/home');
  })
  .catch(err => {
    console.error(err);
  })

  //인증 코드를 사용하여 액세스 토큰을 요청
  // const tokenParams = {
  //   grant_type: 'authorization_code',
  //   client_id: clientId,
  //   redirect_uri: redirectUri,
  //   code: code
  // };

  // try {
  //   const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenParams), {
  //     headers: {
  //       'Authorization': authHeader,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }

  //   })
  //   .then(response => {
  //     console.log(response.data);
  //     req.session.accessToken = response.data.access_token;
  //     const refreshToken = response.data.refresh_token;
  //     console.log(`refreshToken: ${refreshToken}`);
  //     fs.writeFileSync('secret.json', JSON.stringify({ refreshToken }));
  //     res.redirect('/home');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  // } catch (error) {
  //   console.error('Error getting access token:', error);
  //   res.status(500).send('Error getting access token');
  // }
});



// // 스마트싱스에서 리디렉션하고 인증 코드를 수신하는 콜백 핸들러
// router.get('/callback', async (req, res) => {
//     console.log(req.query);
//     const code = req.query.code;

//     //인증 코드를 사용하여 액세스 토큰을 요청
//     const tokenParams = {
//       grant_type: 'authorization_code',
//       client_id: clientId,
//       redirect_uri: redirectUri,
//       code: code
//     };

//     try {
//       const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenParams), {
//         headers: {
//           'Authorization': authHeader,
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }

//       })
//       .then(response => {
//         console.log(response.data);
//         req.session.accessToken = response.data.access_token;
//         const refreshToken = response.data.refresh_token;
//         console.log(`refreshToken: ${refreshToken}`);
//         fs.writeFileSync('secret.json', JSON.stringify({ refreshToken }));
//         res.redirect('/home');
//       })
//       .catch(err => {
//         console.log(err);
//       })
//     } catch (error) {
//       console.error('Error getting access token:', error);
//       res.status(500).send('Error getting access token');
//     }
// });

module.exports = {
  router,
  checkAuth
};
