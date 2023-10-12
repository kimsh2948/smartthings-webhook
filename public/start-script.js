document.getElementById('authButton').addEventListener('click', () => {
    // 스마트싱스 OAuth 인증 엔드포인트 및 클라이언트 정보 설정
    const clientId = 'fa7e64cd-f02d-4c4f-882d-9fe9e9d1f4cf';
    const redirectUri = 'https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/oauth/callback'
    const authorizationUrl = 'https://api.smartthings.com/oauth/authorize';

    // OAuth 인증 흐름 시작
    const authParams = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code'
        };
    const authUrl = `${authorizationUrl}?${new URLSearchParams(authParams)}`;
    console.log(authUrl);
    window.location.href = authUrl;
});
