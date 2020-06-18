import React, { useEffect, useState } from "react";
import {
  AuthContent,
  InputWithLabel,
  AuthButton,
  AuthError,
} from "components/Auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import storage from "lib/storage";
import { isLength, isNumeric } from "validator";
import Axios from "axios";
import * as authActions from "redux/modules/auth";
import * as mapActions from "redux/modules/map";
import * as listActions from "redux/modules/list";
import MapSelector from "./MapSelector";

function CourseUpdate({
  form,
  error,
  result,
  AuthActions,
  MapActions,
  kakaoMap,
  kakao,
  mapResult,
  history,
  match,
  ListActions,
}) {
  const { courseName } = form.toJS();
  const [position, setPosition] = useState({
    longitude: 0,
    latitude: 0,
    stations: [],
  });
  const id = match.params.id;
  const { stations } = position;
  console.log(id, "아이디");

  // 카카오맵 초기화
  useEffect(() => {
    ListActions.getCourse({ id });

    const container = document.getElementById("kakao-map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const pickMarker = new kakao.maps.Marker({
      // 지도 중심좌표에 마커를 생성합니다
      position: map.getCenter(),
    });
    MapActions.setPickMarker(pickMarker);
    MapActions.setMap(map);
  }, []);

  useEffect(() => {
    if (result.course) {
      AuthActions.changeInput({
        name: "courseName",
        value: result.course.courseName,
        form: "course",
      });
      setPosition({
        ...position,
        stations: result.course.stations,
      });
    } else {
      console.log("없습니다");
    }
  }, []);

  const setError = (message) => {
    AuthActions.setError({ form: "course", message });
  };

  const validate = {
    courseName: (value) => {
      if (!isLength(value, { min: 2, max: 15 })) {
        setError("차종은 4~15 글자의 문자 혹은 숫자로 이뤄져야 합니다.");
        return false;
      }
      setError(null);
      return true;
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    AuthActions.changeInput({
      name,
      value,
      form: "course",
    });

    const validation = validate[name](value);
    if (name.indexOf("stations") > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침
  };

  const handleCourseUpdate = async () => {
    if (error) return; // 현재 에러가 있는 상태라면 진행하지 않음
    if (!validate["courseName"](courseName)) return; // 하나라도 실패하면 진행하지 않음
    try {
      await AuthActions.courseUpdate({ courseId: id, courseName, stations });
      history.push("/"); // 회원가입 성공시 홈페이지로 이동
    } catch (error) {
      console.log(error);
      setError("알 수 없는 에러가 발생했습니다.");
    }
  };
  return (
    <AuthContent title="코스수정">
      <InputWithLabel
        value={courseName}
        label="코스이름"
        name="courseName"
        placeholder="서울 ○△동 코스"
        onChange={handleChange}
      />
      <br />
      <MapSelector position={position} setPosition={setPosition} />
      {error && <AuthError>{error}</AuthError>}
      <AuthButton onClick={handleCourseUpdate}>수정하기</AuthButton>
    </AuthContent>
  );
}

export default connect(
  (state) => ({
    form: state.auth.getIn(["course", "form"]),
    error: state.auth.getIn(["course", "error"]),
    result: state.list.get("result").toJS(),
    kakaoMap: state.map.get("map"),
    mapResult: state.map.get("result").toJS(),
    kakao: state.map.get("kakao"),
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    MapActions: bindActionCreators(mapActions, dispatch),
    ListActions: bindActionCreators(listActions, dispatch),
  })
)(CourseUpdate);
