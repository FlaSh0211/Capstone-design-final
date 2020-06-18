import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from 'redux/modules/map';
import { Button, Grid, Stepper, Step, StepButton } from "@material-ui/core";
import { makeStyles } from '@material-ui/core';
import InputWithLabel from "../Auth/InputWithLabel";
import ExtendListItem from "../Base/List/ExtendListItem";
import { media } from 'lib/styleUtils';
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
  addStation: {
    top: '50%'
  },
  stepper: {
    minWidth: '150px',
    overflowX: 'auto'
  },
  stepButton: {
    width: '1rem',
    minWidth: '0.2rem'
  }
}));


// children 이 들어가는 곳
const Contents = styled(StepButton)`
    width: 2rem;
    ${media.phone`
        padding: 1rem;
        width: '0.3rem';
    `}
`;

const MapController = ({searchBtn, addCourseBtn, position}) => {
  const classes = useStyles();
  const [inputs, setInputs] = useState({
    station: '',
    index: 0
  });
  const {stations} = position;
  const {station, index} = inputs;

  const onChangeHandler = e => {
    const {name, value} = e.target;

    setInputs({
      ...inputs,
      [name]: name==='index'? parseInt(value): value
    });
  }

  const onClickHandler = () => {
    if(position.longitude===0 && position.latitude===0){
      alert("아래 지도에서 정류장을 지정해주세요.");
    }else {
      addCourseBtn({idx: index, stationName: station, position});
      setInputs({
        station: '',
        index: index+1
      });
    }
  }

  return (
    <>
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={11} sm={12}>
            {
              stations.length === 0 ? "정류소를 추가해주세요." :
              <Stepper nonLinear className={classes.stepper} orientation="vertical">
                {
                  stations.map(content => (
                    <Step key={content.stationName}>
                      <Contents>
                        {content.stationName}
                      </Contents>
                    </Step>
                  ))
                }
              </Stepper>
            }
          </Grid>
          <Grid item xs={12} sm={7}>
            <InputWithLabel value={station} label="정류장이름" name="station" placeholder="홍대" onChange={onChangeHandler}/>
          </Grid>
          <Grid item xs={4} sm={2}>
            <InputWithLabel value={index} label="정류장 순서" type="number" name="index" placeholder="1" onChange={onChangeHandler}/>
          </Grid>
          <Grid item xs={4} sm={3}>
            <Button 
              variant="contained" 
              color="primary"
              className={classes.addStation} 
              onClick={onClickHandler}
            >
              정류장등록
            </Button>
          </Grid>
          <Grid item xs={4} sm={2}></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={searchBtn}
            >
            위치검색
            </Button>
          </Grid>
          <Grid item>
            <div style={{fontWeight: 'bold'}}>※ 지도에서 정류소를 지정해주세요. ※</div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </>
  )
}

export default MapController;