import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import List from "@material-ui/core/List";
import { LogoWrapper } from "components/List/Car";
import { ListWrapper, BottomNav } from "components/List";
import styled from "styled-components";

import io from "socket.io-client";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as socketActions from "redux/modules/socket";
import * as listActions from "redux/modules/list";
import * as socketEvent from "sockets/listSocket";
import storage from "lib/storage";

import { CarItem } from "containers/List";
import { Button, Grid, IconButton } from "@material-ui/core";
import FormatLineSpacingIcon from "@material-ui/icons/FormatLineSpacing";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "0.5rem",
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

// children 이 들어가는 곳
const Contents = styled.div`
  background: white;
  padding: 1rem 0 1rem 0;
  height: 350px;
  overflow-y: auto;
`;

function FavoriteCarList({
  children,
  myList,
  socket,
  driverList,
  SocketActions,
  ListActions,
  history,
  driverLog,
}) {
  const classes = useStyles();
  const [bottomValue, setBottomValue] = React.useState(0);
  const copyMyList = myList.user
    ? myList.mylist
    : storage.get("myList")
    ? storage.get("myList").mylist
    : null;
  const copyDriverLog = storage.get("driverLog")
    ? storage.get("driverLog")
    : driverLog;
  /* ▼▼▼ [김성현님 수정바람] test용 데이터 송수신 ▼▼▼*/

  useEffect(() => {
    if (socket && myList.user) {
      socketEvent.baseEmiter(socket, copyMyList, copyDriverLog);
      socketEvent.baseListening(socket, ListActions);
      // socketEvent.requestLocation(socket, copyMyList);
    }
  }, [socket, myList.user, ListActions]);

  // MyList 갱신부분
  useEffect(() => {
    ListActions.getMyList(); // MyList 갱신
  }, [ListActions]);

  /* initialize socket */
  useEffect(() => {
    // soket 초기화 부분
    SocketActions.setSocket();
    return () => {
      SocketActions.removeSocket();
    };
  }, []);

  // 아이 탑승 여부에 따라서 학원 색상이 변경!
  // 여기다가 아이가 탑승했다는 값을 받아와서 비교하고 아이가 탑승하고 있다면 색상 변경하는 id를 반환
  const childin = true;

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

  console.log("history=========", history);
  const handleClick = (id) => {
    history.push(`/search/result/${id}`);
  };

  return (
    <ListWrapper>
      <LogoWrapper title="My Page" titleUrl="/"></LogoWrapper>
      <Contents className={classes.contentbox}>
        {copyMyList ? (
          copyMyList.groupList.map((obj) => {
            if (obj.group) {
              return (
                <Grid
                  container
                  className={classes.root}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={2} sm={2}>
                    <Grid container justify="center" alignItems="center">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleClick(obj.group)}
                      >
                        <FormatLineSpacingIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid item xs={10} sm={10}>
                    <CarItem groupId={obj.group} />
                  </Grid>
                </Grid>
              );
            }
          })
        ) : (
          <div>
            <Skeleton variant="text" />
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton variant="rect" width={210} height={118} />
          </div>
        )}
      </Contents>
      <BottomNav value={bottomValue} setValue={setBottomValue} />
    </ListWrapper>
  );
}

export default connect(
  (state) => ({
    driverList: state.socket.getIn(["myList", "driverList"]).toJS(),
    socket: state.socket.get("socket").socket,
    myList: state.list.get("myList").toJS(),
  }),
  (dispatch) => ({
    SocketActions: bindActionCreators(socketActions, dispatch),
    ListActions: bindActionCreators(listActions, dispatch),
  })
)(FavoriteCarList);
