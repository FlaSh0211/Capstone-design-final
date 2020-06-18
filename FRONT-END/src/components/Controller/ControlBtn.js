import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { shadow } from 'lib/styleUtils';
import { Grid, ButtonGroup, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const ControlBtn = ({children, onClick}) => {
  const active = false; // 운전활성화 버튼
  
  return (
    <>
    <ButtonGroup disableElevation variant="contained" color="primary" size="large">
      <Button color={active?'secondary':'primary'}>{active?'운전종료':'운전시작'}</Button>
      <Button>One</Button>
      <Button>Two</Button>
    </ButtonGroup>
    </>
  )
}

export default ControlBtn;