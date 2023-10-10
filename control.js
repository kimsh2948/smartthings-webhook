const express = require('express');
const session = require('express-session');
const router = express.Router();

const checkSession = () => {
    if (!req.session.accessToken) {
        return res.redirect('/login'); // 로그인 페이지로 리다이렉션
    }
};

router.get('/devices', async (req, res) => {
    checkSession();
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
        return deviceId;
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error get device list');
    })
});