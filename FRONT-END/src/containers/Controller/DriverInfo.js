/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Grid,
  ButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as listActions from "redux/modules/list";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import storage from "lib/storage.js";
import styled from "styled-components";
import { shadow } from "lib/styleUtils";
import { media } from "lib/styleUtils";

// 너비, 그림자 설정
const InfoDiv = styled.div`
  // font-weight: bold;
  line-height: 1.5em;
    ${media.wide`
      font-size: 1.5rem;
    `}
    ${media.phone`
      font-size: 1rem;
    `}
    // ${shadow(1)}
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: "100%",
    height: "100%",
  },
  tableBody: {
    "& > tr > td": {
      padding: "16px 4px 16px 8px",
    },
    "& > tr > th": {
      padding: "16px 4px 16px 8px",
      fontWeight: "bold",
    },
  },
}));
const DriverInfo = ({ driverInfo, driverView, result }) => {
  const classes = useStyles();
  const active = false; // 운전활성화 버튼
  const { car, course } = result;
  const { groupName, groupId } =
    driverInfo.groupName.length !== 0
      ? driverInfo
      : storage.get("driverInfo")
      ? storage.get("driverInfo")
      : null;
  let data = null;

  const locSwitch = driverView.setting.indexOf("location") === 0;

  const parsing = car && car.carImageUrl ? car.carImageUrl.split("\\") : null;
  let imgUrl = "http://localhost:4000/api";
  if (parsing) {
    for (const i in parsing) {
      imgUrl += "/" + parsing[i];
    }
  }

  useEffect(() => {
    data = storage.get("driverInfo") ? storage.get("driverInfo") : driverInfo;
  }, []);
  return car && course ? (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={1}
    >
      <Grid item xs={4}>
        {/* 자동차 이미지 */}
        <Avatar alt="Remy Sharp" src={imgUrl} className={classes.large} />
      </Grid>
      <Grid item xs={8}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody className={classes.tableBody}>
              <TableRow key={1}>
                <TableCell component="th" scope="row">
                  학원이름
                </TableCell>
                <TableCell align="right">{groupName}</TableCell>
              </TableRow>
              <TableRow key={1}>
                <TableCell component="th" scope="row">
                  코스이름
                </TableCell>
                <TableCell align="right">{course.courseName}</TableCell>
              </TableRow>
              <TableRow key={1}>
                <TableCell component="th" scope="row">
                  현재위치
                </TableCell>
                <TableCell align="right">
                  {locSwitch ? "????" : "위치공유 필요"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  ) : null;
};

export default connect(
  (state) => ({
    carList: state.list.getIn(["carInfo", "carList"]),
    carInfo: state.list.get("result"),
    driverInfo: state.list.get("driverInfo").toJS(),
    result: state.list.get("result").toJS(),
    driverView: state.list.get("driverView").toJS(),
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch),
  })
)(DriverInfo);
