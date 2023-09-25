// 서버 메모리에 "state" 값을 저장하는 객체 (실제 운영에서는 데이터베이스 또는 안전한 저장 공간을 사용해야 합니다)
const stateStore = {};

// "state" 값을 생성하는 함수
function generateRandomState() {
  // 랜덤 문자열 또는 해시를 생성
  const state = Math.random().toString(36).substring(2); // 랜덤 문자열로 생성하는 예제
  return state;
}

// "state" 값을 저장하는 함수
function saveState(state) {
  // "state" 값을 서버 메모리에 저장 (보안 상의 이유로 실제 운영에서는 안전한 저장 공간을 사용해야 합니다)
  stateStore[state] = true;
}

// 저장된 "state" 값을 가져오는 함수
function getState() {
  // 서버 메모리에서 "state" 값을 가져옴
  return stateStore;
}

// "generateRandomState", "saveState", "getState" 함수를 모듈로 내보냄
module.exports = {
  generateRandomState,
  saveState,
  getState
};