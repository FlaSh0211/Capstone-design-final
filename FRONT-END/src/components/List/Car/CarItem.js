import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, ListItemIcon, makeStyles } from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '1rem'
  },
}));

export default function CarItem({ value, labelId, bottomValue }) {
  const classes = useStyles();
  return (
    <ListItem key={value.id} button className={classes.root}>
      <ListItemAvatar>
        <Avatar
          alt={`Avatar n°${value.id + 1}`}
          src={`/static/images/avatar/${value.id + 1}.jpg`}
        />
      </ListItemAvatar>
      <ListItemText id={labelId} primary={`${value.driverName}`} />
      <ListItemSecondaryAction>
        { bottomValue === 2 ?
          <DeleteIcon/>
          : null
        }
        
      </ListItemSecondaryAction>
      <ListItemIcon>
        { value.active ?
            <FaceIcon color="secondary"/>
          : <FaceIcon />
        }
      </ListItemIcon>
    </ListItem>
  );
}