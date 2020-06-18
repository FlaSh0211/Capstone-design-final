import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MapIcon from '@material-ui/icons/Map';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SettingBox({setting, ListActions}) {
  const classes = useStyles();

  const handleToggle = (value) => () => {
    const currentIndex = setting.indexOf(value);
    const newChecked = [...setting];
    if (currentIndex === -1) {
      // active --> value==='location' 일때 룸에접속
      newChecked.push(value);
    } else {
      // deactive --> value==='location' 일때 룸탈출
      newChecked.splice(currentIndex, 1);
    }
    ListActions.changeDriverView({name: 'setting', value: newChecked})
  };

  return (
    <List subheader={<ListSubheader>Settings</ListSubheader>} className={classes.root}>
      
      <Grid container>
        <Grid item sm={6} xs={12}>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon color={setting.indexOf('location') !== -1 ? "secondary" : "disabled"}/>
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" primary="위치공유" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                onChange={handleToggle('location')}
                checked={setting.indexOf('location') !== -1}
                inputProps={{ 'aria-labelledby': 'switch-list-label-location' }}
              />
            </ListItemSecondaryAction >
          </ListItem>
        </Grid>
        <Grid item sm={6} xs={12}>
          <ListItem>
            <ListItemIcon>
              <MapIcon color={setting.indexOf('map') !== -1 ? "primary" : "disabled"} />
            </ListItemIcon>
            <ListItemText id="switch-list-label-map" primary="현위치보기" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                onChange={handleToggle('map')}
                checked={setting.indexOf('map') !== -1}
                inputProps={{ 'aria-labelledby': 'switch-list-label-map' }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </Grid>
      </Grid>
    </List>
  );
}
