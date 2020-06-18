/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { AdminWrapper } from "components/Admin";
import { ControlBtn } from "components/Controller";
import { DriverInfo, SettingBox } from "containers/Controller";

import * as listActions from "redux/modules/list";
import * as socketActions from "redux/modules/socket";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import storage from "lib/storage.js";
import CustomConsole from "lib/CustomConsole";
import {
  Grid,
  makeStyles,
  FormControlLabel,
  FormGroup,
  Switch,
  Divider,
} from "@material-ui/core";
import styled from "styled-components";
import { media } from "lib/styleUtils";

import * as driverEvent from "sockets/driverSocket";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function DriverCtrl({
  driverInfo,
  carList,
  driverView,
  socket,
  ListActions,
  SocketActions,
  carInfo,
  history,
  driverLog,
}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedA: true,
  });
  let data = null;
  // 화면을 컨트롤하는 변수들
  const { setting } = driverView;
  // information component를 바꿔주는 스위치변수
  const infoSwitch = setting.indexOf("map") === -1;
  const copyDriverLog = storage.get("driverLog")
    ? storage.get("driverLog")
    : driverLog;
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  /* initialize socket */
  useEffect(() => {
    // soket 초기화 부분
    SocketActions.setSocket();
    return () => {
      storage.remove("driverLog");
    };
  }, []);

  useEffect(() => {
    CustomConsole.correct("운전자페이지 접속", "화면에서 메뉴를 선택해주세요.");
    data = storage.get("driverInfo") ? storage.get("driverInfo") : driverInfo;
    if (data.auth) {
      ListActions.getCourse({ id: data.courseId });
      ListActions.getCar({ id: data.carId });
    }
  }, [ListActions]);

  useEffect(() => {
    // myData =
    data = storage.get("driverInfo") ? storage.get("driverInfo") : driverInfo;

    if (socket && data.auth) {
      console.log("copy", copyDriverLog);
      driverEvent.joinRoom(socket, data.courseId);
      driverEvent.baseListening(
        socket,
        data.courseId,
        data.groupId,
        ListActions
        // copyDriverLog._id,
        // copyDriverLog.name
      );
      driverEvent.sendDriverGPS(
        socket,
        data.courseId
        // copyDriverLog._id,
        // copyDriverLog.name
      );
    }
  }, [socket]);

  // 로컬저장소에 현재 운전할 정보를 저장
  useEffect(() => {
    driverInfo.auth && storage.set("driverInfo", driverInfo);
  }, [driverInfo]);

  return (
    <AdminWrapper path="/" title="DRIVER-MODE">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <SettingBox setting={setting} ListActions={ListActions} />
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {infoSwitch ? <DriverInfo /> : <div>지도입니다.</div>}
        </Grid>
      </Grid>
    </AdminWrapper>
  );
}

export default connect(
  (state) => ({
    carList: state.list.getIn(["carInfo", "carList"]),
    carInfo: state.list.get("result"),
    driverInfo: state.list.get("driverInfo").toJS(),
    driverView: state.list.get("driverView").toJS(),
    socket: state.socket.get("socket").socket,
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch),
    SocketActions: bindActionCreators(socketActions, dispatch),
  })
)(DriverCtrl);
