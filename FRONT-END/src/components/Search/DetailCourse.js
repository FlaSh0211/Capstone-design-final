import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ExtendListItem } from 'components/Base/List';
import styled from 'styled-components';
import { List, IconButton, ListItem, ListItemText } from '@material-ui/core';

import DriveEtaIcon from '@material-ui/icons/DriveEta';
import CreateIcon from '@material-ui/icons/Create';

import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { yellow } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    fab: {
      margin: theme.spacing(2),
    },
    root: {
      width: '100%',
      maxWidth: 500,
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
    },
    favorite: {
      marginLeft: 2
    }
  }));

const handleOnUpdate = (route) => {
};
export default function DetailCourse({ role, courseList, isExist, validationCourse, handleFavorite }) {
  const classes = useStyles();
  return (
    <>
      <hr/> 
      <List className={classes.root}>
        {
          courseList.map(course => {
            const result = validationCourse({_id: course._id});
            return (
              <ListItem key="1" role={undefined} dense button onClick={function(){}}>
                <DriveEtaIcon className={classes.icon}/>
                  <ListItemText id={1} primary={<ExtendListItem title={course.courseName} subContent={course.stations}/> }/>      
                  {
                    role !== 'none'
                    ? (<FormControlLabel
                      className = {classes.favorite}
                      control={
                        <Checkbox 
                          icon={
                            result
                            ?<StarIcon style={{ color: yellow[500] }} />
                            :<StarBorderIcon /> 
                          } 
                          checkedIcon={
                            result
                            ?<StarIcon style={{ color: yellow[500] }} />
                            :<StarBorderIcon style={{ color: "#696969" }}/>
                          } name="checkedH" 
                        />   
                      }
                      onClick = {() => handleFavorite({courseId: course._id, groupId: course.group})}
                    />)
                    : null
                  }
              </ListItem>
            )}
          )
                
        }
      </List>
    </>
  )
}