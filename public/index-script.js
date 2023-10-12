// script.js
document.addEventListener("DOMContentLoaded", () => {
    const deviceListContainer = document.querySelector('.device-list');
    const deviceDetailsContainer = document.querySelector('.device-details');
    const deviceImage = document.querySelector('.device-image');
    const deviceStatus = document.querySelector('.device-status');

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
            const response = await fetch(`https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/control/device-status?${deviceId}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log(data);

            let imageURL = '';
            const status = data.components.main.switch.switch.value;
            deviceStatus.textContent = status;
            if (status === 'on'){
                deviceImage.src = `/image/switch-on`;
            } else if (status === 'off'){
                deviceImage.src = `/image/switch-off`;
            }

        } catch (error) {
            console.error('Error controlling device:', error);
        }
    }

    // 디바이스를 제어하는 함수
    async function controlDevice(deviceId) {
        try {
            // API를 호출하여 디바이스 제어 요청
            const response = await fetch(`https://port-0-smartthings-webhook-2rrqq2blmqxv7cr.sel5.cloudtype.app/control/devices/${deviceId}/toggle`, {
                method: 'POST',
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
