import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CourseTitle({name, currentLoc, active}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={5}>
          { 
            name.length > 7  
            ? name.slice(0, 6)+'...'
            : name
          }
        </Grid>
        <Grid item xs={5}>
          {
            active 
            ? currentLoc.length > 7
              ? currentLoc.slice(0, 6)+'...'
              : currentLoc
            : ''
          }
        </Grid>
        <Grid item xs={2}>
          {
            active
            ? <FaceIcon color="secondary" />
            : <FaceIcon color="disabled" />
          }
        </Grid>
      </Grid>
    </div>
  );
}
