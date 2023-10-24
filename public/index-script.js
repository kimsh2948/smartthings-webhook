// script.js
document.addEventListener("DOMContentLoaded", () => {
    const deviceListContainer = document.querySelector('.device-list');
    const deviceDetailsContainer = document.querySelector('.device-details');
    const deviceImage = document.getElementById('device-image');
    const deviceStatus = document.getElementById('device-status');
    const controlButton = document.getElementById('control-button');
    const functionListContainer = document.getElementById('function-list');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        console.log(value);
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // API에서 디바이스 목록을 가져오는 함수
    async function fetchDeviceList() {
        try {
            const urlParams = new URL(location.href).searchParams;
            const code = urlParams.get('code');
            if (code != null) {
                const tokenResponse = await fetch(`https://smartthings.ami-konai.com/oauth/code?code=${code}`, {
                    method: 'GET',
                });
                console.log(tokenResponse);
            }

            const sessionId = getCookie('connect.sid');

            // 읽어온 세션 ID를 콘솔에 출력 (테스트용)
            console.log('세션 ID:', sessionId);

            const response = await fetch('https://smartthings.ami-konai.com/devices', {
                method: 'GET',
            });

            const data = await response.json();
            console.log(data);

            // 가져온 디바이스 목록을 HTML에 추가
            data.forEach(device => {
                const deviceItem = document.createElement('p');
                deviceItem.className = 'device-item';
                deviceItem.textContent = device.name;
                deviceListContainer.appendChild(deviceItem);

                // 디바이스 아이템을 클릭할 때 상태 조회 및 UI 업데이트 수행
                deviceItem.addEventListener('click', async () => {
                    await fetchDeviceStatus(device.deviceId); // 디바이스 상태 조회 및 UI 업데이트
                    deviceDetailsContainer.style.display = 'block'; // 디바이스 상세 정보 보이기
                });

            });
        } catch (error) {
            console.error('Error fetching device list:', error);
        }
    }
    // 디바이스 상태조회하는 함수
    async function fetchDeviceStatus(deviceId) {
        try {
            // API를 호출하여 디바이스 제어 요청
            const response = await fetch(`https://smartthings.ami-konai.com/device/status?device_id=${deviceId}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log(data);

            let imageURL = '';
            deviceStatus.textContent = '';
            const status = data.components.main.switch.switch.value;
            if (status === 'on'){
                deviceImage.src = `/image/switch-on.png`;
            } else if (status === 'off'){
                deviceImage.src = `/image/switch-off.png`;
            }
            deviceStatus.textContent = `상태 : ${status}`;

            // '제어하기' 버튼을 보이도록 설정
            controlButton.style.display = 'block';
            functionListContainer.innerHTML = ''; // 기능 목록 초기화

            // '제어하기' 버튼 클릭 시 이벤트 핸들러 등록
            controlButton.addEventListener('click', async () => {
                await fetchDeviceInfo(deviceId);
            });

        } catch (error) {
            console.error('Error controlling device:', error);
        }
    }
    // 디바이스를 제어하는 함수
    async function fetchDeviceInfo(deviceId) {
        try {
            // API를 호출하여 디바이스 제어 요청
            const response = await fetch(`https://smartthings.ami-konai.com/device/command-info?device_id=${deviceId}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log(data); // 성공한 경우에 대한 응답을 콘솔에 출력
            functionListContainer.innerHTML = '';

            // 기능 목록을 가져와서 추가
            for (const functionName of data) {
                const functionItem = document.createElement('div');
                functionItem.textContent = functionName.commandId;

                for (const [commandName, commandValue] of Object.entries(functionName.command)) {
                    const commandItem = document.createElement('button');
                    commandItem.textContent = commandName;
                    functionItem.appendChild(commandItem);
                    commandItem.addEventListener('click', async () => {
                        await controlDevice(deviceId, functionName.command_id, commandValue.name, commandValue.arguments);
                    });
                }
                functionListContainer.appendChild(functionItem);
            }

        } catch (error) {
            console.error('Error controlling device:', error);
        }
    }

    // 디바이스를 제어하는 함수
    async function controlDevice(deviceId, deviceCapId, command, arguments) {
        try {
            const postData = {
                device_id: deviceId,
                device_cap_id: deviceCapId,
                command: command,
                arguments: arguments
            };
            console.log(postData);
            // API를 호출하여 디바이스 제어 요청
            const response = await fetch(`https://smartthings.ami-konai.com/device/control`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            console.log(data); // 성공한 경우에 대한 응답을 콘솔에 출력

            if (data.results[0].status === 'ACCEPTED') {
                await fetchDeviceStatus(deviceId);
            } else {
                console.error(data);
            }

        } catch (error) {
            console.error('Error controlling device:', error);
        }
    }

    // 페이지 로드 시 디바이스 목록을 가져옴
    fetchDeviceList();
});

document.addEventListener()
