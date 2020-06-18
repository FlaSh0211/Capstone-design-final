import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import {AdminWrapper} from 'components/Admin';
import { Tooltip, Fab, Grid } from '@material-ui/core';

import * as listActions from 'redux/modules/list';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import storage from 'lib/storage.js';
import { CustomListItem } from 'components/Base/List';

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  root: {
    width: '100%',
    maxWidth: 500,
    height: 290,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    marginRight: '1rem'
  },
  bottomBtn: {
    float: 'bottom'
  }
}));

function CarList({history, carList, ListActions, carInfo}) {
  const classes = useStyles();
  const adminInfo = storage.get("adminInfo");

  useEffect(() => {
    const id = adminInfo.group;
    ListActions.getCars({id});
  }, []);

  const handleOnClick = async (route) => {
    history.push(route) 
  };

  const handleOnUpdate = async (route,id) => {
    await ListActions.getCar({id});
    history.push(route) 
  };
 
  return (
    <AdminWrapper>
      <List className={classes.root}>
        {
          carList.map(car => (
            <ListItem key="1" role={undefined} dense button onClick = {() => handleOnUpdate(`/admin/car/update/${car._id}`, car._id)}>
              <DriveEtaIcon className={classes.icon}/>
              <ListItemText id={1} primary={<CustomListItem title={car.carName} subTitle={car.carNumber} /> }/>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
      </List>
      <Grid container spacing={2} className={classes.bottomBtn}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <Tooltip title="Add" aria-label="add" className={classes.insertButton} onClick={() => handleOnClick("/admin/car/register")}>
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
    carList: state.list.getIn(['carInfo', 'carList']),
    carInfo: state.list.get('result')
  }),
  (dispatch) => ({
      ListActions: bindActionCreators(listActions, dispatch)
  })
)(CarList);