import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import { AdminWrapper } from "components/Admin";
import { Tooltip, Fab, Grid } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";

import * as listActions from "redux/modules/list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import storage from "lib/storage.js";
import { CustomListItem, ExtendListItem } from "components/Base/List";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  root: {
    width: "100%",
    maxWidth: 500,
    height: 290,
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    marginRight: "1rem",
  },
  bottomBtn: {
    float: "bottom",
  },
  updatebtn: {
    "& > span": {
      margin: theme.spacing(2),
    },
  },
}));

function CourseList({ history, courseList, ListActions }) {
  const classes = useStyles();
  const adminInfo = storage.get("adminInfo");

  useEffect(() => {
    const id = adminInfo.group;
    ListActions.getCourses({ id });
  }, []);

  const handleOnClick = async (route) => {
    history.push(route);
  };
  const handleOnUpdate = async (route, id) => {
    await ListActions.getCourse({ id });
    history.push(route);
  };
  const courseDelete = (id) => {
    ListActions.deleteCourse({ id });
    ListActions.getCourses({ id: adminInfo.group });
  };

  return (
    <AdminWrapper>
      <List className={classes.root}>
        {courseList.map((course) => (
          <ListItem
            key="1"
            role={undefined}
            dense
            button
            onClick={function () {}}
          >
            <DriveEtaIcon className={classes.icon} />
            <ListItemText
              id={1}
              primary={
                <ExtendListItem
                  title={course.courseName}
                  subContent={course.stations}
                />
              }
            />
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() =>
                handleOnUpdate(`/admin/course/update/${course._id}`, course._id)
              }
            >
              <CreateIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => courseDelete(course._id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Grid container spacing={2} className={classes.bottomBtn}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <Tooltip
              title="Add"
              aria-label="add"
              className={classes.insertButton}
              onClick={() => handleOnClick("/admin/course/register")}
            >
              <Fab color="primary" className={classes.fab}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </AdminWrapper>
  );
}

export default connect(
  (state) => ({
    courseList: state.list.getIn(["courseInfo", "courseList"]),
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch),
  })
)(CourseList);
