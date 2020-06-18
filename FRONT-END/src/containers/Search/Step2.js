import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { CustomListItem, ExtendListItem } from 'components/Base/List';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

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
  },
  updatebtn: {
    '& > span': {
      margin: theme.spacing(2),
    }
  }
}));

export default function Step2({handleChange, sendData, courseList}) {
  const classes = useStyles();
  const { courseId } = sendData;
  return (
    <>
      <List className={classes.root}>
        <FormControl component="fieldset">
          <RadioGroup name="courseId" value={courseId} onChange={handleChange}>
          {
            courseList.map(course => (
              <>
                <FormControlLabel 
                  value={course._id} 
                  control={<Radio />} 
                  label={(
                    <ListItem key={course._id} role={undefined} dense button onClick={function(){}}>
                      <ListItemText id={1} primary={<ExtendListItem title={course.courseName} subContent={course.stations}/> }/>      
                    </ListItem>
                  )} 
                />
            </>
            ))
          }
          </RadioGroup>
        </FormControl>
      </List>
    </>
  )
}