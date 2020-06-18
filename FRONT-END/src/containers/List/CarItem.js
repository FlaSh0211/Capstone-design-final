import React, { useEffect, useState } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as listActions from "redux/modules/list";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FavoriteExtendListItem } from "components/Base/List";
import StarIcon from "@material-ui/icons/Star";
import { yellow } from "@material-ui/core/colors";
import storage from "lib/storage";

const useStyles = makeStyles((theme) => ({
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  button: {
    backgroundColor: "#ffac32",
    borderColor: "#ffac32",
    marginLeft: 100,
    "&:hover": {
      backgroundColor: "#ffac32",
      borderColor: "#ffac32",
    },
    "&:active": {
      backgroundColor: "#ffac32",
      borderColor: "#ffac32",
    },
  },
  padding: {
    paddingRight: 10,
  },
  contentbox: {
    height: "21rem",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
  },
  inCar: {
    backgroundColor: "#0ca678",
    color: "white",
    // [문정민] 아래 보더인지 shadow인지 없애시오
  },
  none: {},
  skeleton: {
    width: "100%",
    height: "50px",
  },
}));

const handleActive = ({ groupId, courseId, active }) => {
  if (active[groupId]) {
    return active[groupId][courseId];
  }
  return false;
};

function CarItem({
  groupId,
  courseInfo,
  myData,
  active,
  ListActions,
  driverLoc,
}) {
  const classes = useStyles();
  const [data, setData] = useState({});
  let myRole,
    courseList,
    groupInfo = null;
  // 데이터 초기화
  if (myData[groupId] || storage.get("myData")) {
    myRole = myData[groupId]
      ? myData[groupId].myRole
      : storage.get("myData").myRole;
    courseList = myData[groupId]
      ? myData[groupId].courseList
      : storage.get("myData").courseList;
    groupInfo = myData[groupId]
      ? myData[groupId].groupInfo
      : storage.get("myData").groupInfo;
  }

  // 데이터를 보관 및 관리
  useEffect(() => {
    ListActions.setMyData({ id: groupId });
  }, [ListActions, groupId]);

  useEffect(() => {
    if (courseInfo.groupInfo._id == groupId) {
      setData({
        ...courseInfo,
      });
    }
  }, [courseInfo]);
  // 아이 탑승 여부에 따라서 학원 색상이 변경!
  // 여기다가 아이가 탑승했다는 값을 받아와서 비교하고 아이가 탑승하고 있다면 색상 변경하는 id를 반환
  const childin = false;

  // 색상 변경하는 id를 반환하는 함수
  function checkchild() {
    return classes.inCar;
  }

  // 색상 변경하지 않는 id를 반환하는 함수
  function none() {
    return classes.none;
  }

  // Expend 부분
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return myData[groupId] ? (
    <ExpansionPanel
      className={childin === true ? checkchild() : none()}
      width="100%"
    >
      {/*child 값에 따라서 색상 변경*/}
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <StarIcon style={{ color: yellow[500] }} className={classes.padding} />
        <Typography className={classes.heading}>
          이름: {groupInfo.name}
        </Typography>
        {/* 위의 현재: 이후의 {}안에 현재 위치 값 받아오기를 넣어야 한다!*/}
      </ExpansionPanelSummary>
      {courseList.map((obj) => (
        <ExpansionPanelDetails style={{ padding: "0 24px 12px 24px" }}>
          <FavoriteExtendListItem
            title={obj.courseName}
            subContent={obj.stations}
            id={obj._id}
            active={handleActive({ groupId, courseId: obj._id, active })}
            distPer={obj.distPer}
            nextStation={obj.nextStation}
            driverLoc={driverLoc}
            data = {obj.data}
          />
        </ExpansionPanelDetails>
      ))}
    </ExpansionPanel>
  ) : (
    <div className={classes.skeleton}>
      <Skeleton variant="rect" animation="wave" height={40} />
    </div>
  );
}

export default connect(
  (state) => ({
    courseInfo: state.list.get("courseInfo").toJS(),
    myData: state.list.get("myData").toJS(),
    active: state.list.get("active"),
    driverLoc: state.list.get("driverLoc"),
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch),
  })
)(CarItem);
