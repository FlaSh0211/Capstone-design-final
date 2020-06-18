/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LogoWrapper } from 'components/List/Car';
import { SkeletonCard } from 'components/Base/Skeleton';
import styled from 'styled-components';
import * as listActions from 'redux/modules/list';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import Modal from '@material-ui/core/Modal';

import { DetailContent, DetailCourse } from 'components/Search';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { yellow } from '@material-ui/core/colors';
import { IconButton, Button } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const useStyles = makeStyles((theme) => ({
  
  root: {
    maxWidth: 345,
    margin: "auto"
  },
  media: {
    paddingTop: '60%',
    overflow: 'hidden'
  },
  CardContent: {
    maxwidth: 140
  },
  paper: {
    paddingLeft:10,
    paddingBottom: 10
  },
  modalPaper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 600,
    maxHeight: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
  modalImgContainer: {
    overflowY: 'auto',
    width: '100%',
    height: 400
  },
  modalGridPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  favorite: {
    marginLeft: 2,
    width: 20,
    height: 20
  },
  button: {
    margin: theme.spacing(1),
    width: '10em'
  }
}));

// children 이 들어가는 곳
const Contents = styled.div`
  background: white;
  padding: 1rem 0 1rem 0;
`;

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const isExist = ({ dataList, attr, target }) => {
  const exist = attr
    ? dataList.filter(obj => String(obj[attr]) === target)
    : dataList.filter(el => String(el) === target);

  return exist.length == 0 ? false : true;
}

function SearchDetail({history, match, ListActions, courseInfo, myList}) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const { courseList, groupInfo, memberInfo } = courseInfo;
  const { id } = match.params;

  const [favouritesGroup, setFavouritesGroup ] = useState(false);

  const parsing = groupInfo.certification? groupInfo.certification.split('\\') : null;
  let imgUrl = 'http://localhost:4000/api';
  if(parsing){
    for(const i in parsing) {
      imgUrl += '/'+parsing[i]
    }
  }

  useEffect(() => {
    ListActions.getCourses({ id }); // id: groupId 의 코스들을 가져옴
    ListActions.getMyList(); // MyList 갱신
  }, [ListActions, id])

  useEffect(() => {
    const { id } = match.params;
    const myGroup = myList!=undefined
      ? myList.groupList.filter(obj => obj.group == id)[0]
      : null;
    let result = myList!=undefined 
      ? isExist({dataList: myList.groupList, target: id, attr: 'group'})
      : false;
    setFavouritesGroup(result);
  }, [match.params, myList])

  const validationGropup = ({_id}) => {
    const result = isExist({dataList: myList.groupList, target: _id});
    setFavouritesGroup(result);
  }

  const validationCourse = ({_id}) => {
    const myGroup = myList!=undefined
      ? myList.groupList.filter(obj => obj.group == id)[0]
      : null;
    console.log(myGroup)
    const result = myGroup
      ? isExist({dataList: myGroup.courses, target: _id})
      : false;
    return result
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFavorite = ({ groupId, courseId }) => {
    const check = prompt('즐겨찾기를 추가/해제 하시겠습니까?', 'yes');
    if (check === 'yes') {
      const result = groupId && courseId
        ? ListActions.coursePushRemove({groupId, courseId}) // course 추가
        : ListActions.groupPushRemove({groupId}); // group 추가
      history.go(history.location);
    }
  }

  const handleHistory = ({type, path}) => {
    switch (type) {
      case 'go':
        history.go(path); // path 로 이동, redirection이 일어남
        break;

      default:
        path
        ? history.push(path)
        : history.push('/');  // 메인으로
        break;
    }
  }

  // this is modal component
  const body = (
    <Grid container spacing={3} style={modalStyle} className={classes.modalPaper}>
      <Grid item xs={12} sm={12}>
        <Paper className={classes.modalGridPaper}>
          <h2 id="simple-modal-title">Certification</h2>
          <p id="simple-modal-description">
            {groupInfo.name} 학원 인증서입니다.
          </p>
          <div className={classes.modalImgContainer}>
              <img 
                src={imgUrl} 
                alt="certification image"
              />
            </div>
        </Paper>
      </Grid>
    </Grid>
  );

  
const RoleController = ({role, handleHistory, id}) => {
  let result = {
    path: '',
    title: '',
    startIcon: '',
    endIcon: ''
  };

  switch (role) {
    case 'driver':
      ListActions.changeDriverInfo({name: 'groupName', value: groupInfo.name});
      ListActions.changeDriverInfo({name: 'groupId', value: groupInfo._id});
      result = {
        path: `/search/driverSelector/${ id }`,
        title: '운전하기',
        startIcon: <DriveEtaIcon />
      };
      break;
    case 'none':
      result = {
        path: `/auth/group/register/${ id }`,
        title: '그룹가입',
        startIcon: <AccountBoxIcon />
      };
      break;
    default:
      result = null;
      break;
  }
  // const content = result
  // ? (<div>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         className={classes.button}
  //         startIcon={result.startIcon}
  //         onClick={()=>handleHistory({path: result.path})}
  //       >
  //         {result.title}
  //       </Button>
  //     </div>)
  // : null;

  return result
  ? (<div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={result.startIcon}
          onClick={()=>handleHistory({path: result.path})}
        >
          {result.title}
        </Button>
      </div>)
  : null;
}

  return (
    <div className = "null" style={{overflowX: "hidden", height: "39rem"}}>
      <LogoWrapper title={groupInfo.name} >
      </LogoWrapper>

      <Contents>
        {
          groupInfo._id 
          ? <>
            <CardMedia 
              className={classes.media}
              image={imgUrl}
              title="certification"
              onClick={handleOpen}
            />
            {
              memberInfo.role !== 'none'
              ? (<FormControlLabel
                  className = {classes.favorite}
                  control={
                    <>
                      <Checkbox 
                        icon={
                          favouritesGroup
                          ?<StarIcon style={{ color: yellow[500] }} />
                          :<StarBorderIcon /> 
                        } 
                        checkedIcon={
                          favouritesGroup
                          ?<StarIcon style={{ color: yellow[500] }} />
                          :<StarBorderIcon style={{ color: "#696969" }}/>
                        } name="checkedH" 
                      />
                    </>        
                  }
                  onClick = {() => handleFavorite({groupId: id})}
              />)
              : null
            }
            
            {
              RoleController({role: memberInfo.role, handleHistory, id: groupInfo._id})
            }
            <DetailContent content={groupInfo} />
            <DetailCourse 
                courseList={courseList}
                validationCourse={validationCourse}
                role={memberInfo.role}
                isExist = {isExist}
                handleFavorite={handleFavorite}
            />
            
            </>
          : <SkeletonCard />
        }
      </Contents>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

export default connect(
  (state) => ({
    courseInfo: state.list.get('courseInfo').toJS(),
    myList: state.list.get('myList').toJS().mylist
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch) 
  })
)(SearchDetail);