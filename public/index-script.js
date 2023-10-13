// script.js
document.addEventListener("DOMContentLoaded", () => {
    const deviceListContainer = document.querySelector('.device-list');
    const deviceDetailsContainer = document.querySelector('.device-details');
    const deviceImage = document.getElementById('device-image');
    const deviceStatus = document.getElementById('device-status');
    const controlButton = document.getElementById('control-button');
    const functionListContainer = document.getElementById('function-list');

    // API에서 디바이스 목록을 가져오는 함수
    async function fetchDeviceList() {
        try {
            const response = await fetch('https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/control/devices', {
                method: 'GET',
            });

            const data = await response.json();

            // 가져온 디바이스 목록을 HTML에 추가
            data.forEach(device => {
                const deviceItem = document.createElement('div');
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
            const response = await fetch(`https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/control/device-status?deviceId=${deviceId}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log(data);

            let imageURL = '';
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
            const response = await fetch(`https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/control/device-info?deviceId=${deviceId}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log(data); // 성공한 경우에 대한 응답을 콘솔에 출력

            // 기능 목록을 가져와서 추가
            for (const functionName of data) {
                const functionItem = document.createElement('div');
                functionItem.textContent = functionName.commandId;

                for (const [commandName, commandValue] of Object.entries(functionName.command)) {
                    const commandItem = document.createElement('div');
                    commandItem.textContent = `제어 : ${commandName}`;
                    functionItem.appendChild(commandItem);
                    commandItem.addEventListener('click', async () => {
                        await controlDevice(deviceId, commandValue.name, commandValue.arguments, functionName.capVersion);
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
                deviceId: deviceId,
                deviceCapId: deviceCapId,
                command: command,
                arguments: arguments
            };
            // API를 호출하여 디바이스 제어 요청
            const response = await fetch(`https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/control/devices/${deviceId}/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            console.log(data); // 성공한 경우에 대한 응답을 콘솔에 출력
        } catch (error) {
            console.error('Error controlling device:', error);
        }
    }

    // 페이지 로드 시 디바이스 목록을 가져옴
    fetchDeviceList();
});

document.addEventListener()
