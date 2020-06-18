// 로컬 스토리지에 JSON 형태로 저장 / 불러오기 / 삭제 헬퍼

const storage = {
  set: (key, object) => {
    if(!localStorage) return; // localStorage가 없다면 종료
    localStorage[key] = (typeof object) === 'string' ? object : JSON.stringify(object);
  },
  get: (key) => {
    if(!localStorage) return null; // localStorage가 없다면 null
    if(!localStorage[key]) return null; // 찾는 data가 localStorage가 없다면 null

    try {
      const parsed = JSON.parse(localStorage[key]);
      return parsed;
    } catch (error) {
      return localStorage[key];
    }
  },
  remove: (key) => {
    if(!localStorage) return null;
    
    if(localStorage[key]) {
      localStorage.removeItem(key);
    }
  }
};

export default storage;