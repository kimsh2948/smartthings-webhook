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

//디바이스 전체 목록 조회
router.get('/devices', (req, res) => {
    checkSession(req, res);
    const accessToken = req.session.accessToken;
    console.log(accessToken);

    axios.get(`/devices`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data.items);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error get device list');
    })
});

//디바이스 상태 조회
router.get('/device-status', (req, res) => {
    const deviceId = req.query.deviceId;

    axios.get(`/devices/${deviceId}/status`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error get device status');
    })
});

//디바이스 정보 조회로 사용 가능 기능 추출
router.get('/device-info', (req, res) => {
    const deviceId = req.query.deviceId;

    axios.get(`/devices/${deviceId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error get device info');
    })
});

//디바이스 커맨드 조회
router.get('/device-control', (req, res) => {
    const deviceId = req.query.deviceId;
    const deviceCapId = req.query.deviceCapId;
    const deviceCapVersion = req.query.deviceCapVersion;

    axios.get(`/capabilities/${deviceCapId}/${deviceCapVersion}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data.commands);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error get commands');
    })
});

//디바이스 제어
router.post('/device-control', (req, res) => {
    const deviceId = req.body.deviceId;
    const deviceCapId = req.body.deviceCapId;
    const command = req.body.command;
    const arguments = req.body.arguments;

    console.log(req.body);

    axios.post(`/devices/${deviceId}/commands`, {
        commands: [
            {
                component: "main",
                capability: deviceCapId,
                command: command,
                arguments: arguments
            }
        ]
    },
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.log(err.response.data.error);
        res.status(500).send(`Error control device`);
    })
});

module.exports = router;