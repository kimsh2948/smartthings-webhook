// script.js
document.addEventListener("DOMContentLoaded", () => {
    const deviceListContainer = document.querySelector('.device-list');

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
            });
        } catch (error) {
            console.error('Error fetching device list:', error);
        }
    }

    // 페이지 로드 시 디바이스 목록을 가져옴
    fetchDeviceList();
});

document.addEventListener()
