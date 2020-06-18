디렉토리 만들기
이번 프로젝트의 디렉토리 구조는 다음과 같습니다:

components: 프리젠테이셔널 컴포넌트들이 위치합니다
containers: 컨테이너 컴포넌트들이 위치합니다
lib: 프로젝트에서 필요한 함수들을 여기에 저장합니다
pages: 라우트 관련 컴포넌트들이 위치합니다
redux: 리덕스 관련 코드가 위치합니다
위 디렉토리들을 src 폴더 안에 미리 만들어주세요.

---------------
socket 관련

Server ::: 

서버에서 특정 Driver가 활성화된것을 감지했을때 ===>
`socket.emit("driverActive", {driver: driver1, active: true}); // test용 driver 활성화 [test]`
특정 유저의 정보를 갱신시킨다...