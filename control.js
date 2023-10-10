const express = require('express');
const session = require('express-session');
const axios = require('axios');
const router = express.Router();

axios.defaults.baseURL = 'https://api.smartthings.com';

// 환경변수로 node에서 허가되지 않은 인증TLS통신을 거부하지 않겠다고 설정
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const checkSession = (req, res) => {
    if (!req.session.accessToken) {
        return res.redirect('/oauth/login'); // 로그인 페이지로 리다이렉션
    }
};

router.get('/devices', async (req, res) => {
    checkSession(req, res);
    const accessToken = req.session.accessToken;

    axios.get(`/devices`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        console.log(response.data);
        const deviceId = response.data.items[1].deviceId;
        console.log(deviceId);
        res.send(response.data.items);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error get device list');
    })
});

module.exports = router;