import React, { useEffect, useState } from 'react';
import { SearchStepper } from 'components/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'redux/modules/auth';
import * as userActions from 'redux/modules/user';
import * as listActions from 'redux/modules/list';
import {isEmail, isLength, isAlphanumeric} from 'validator';
import { LogoWrapper } from 'components/List/Car';
import styled from 'styled-components';
import * as MyListAPI  from 'lib/api/myList';
import storage from 'lib/storage';
import CustomConsole from 'lib/CustomConsole';

const Contents = styled.div`
    background: white;
    padding: 1rem 1rem 1rem 1rem;
    height: auto;
`;

function AdminRegister({ driverInfo, courseList, carList, error, AuthActions, match, ListActions, history }) {
  const adminInfoId = storage.get('adminInfo');
  const { carId, courseId } = driverInfo;

  useEffect(() => {
    return () => {
      AuthActions.initializeForm('admin');
    };
  }, [AuthActions]);

  useEffect(() => {
    const { id } = match.params;
    ListActions.getCourses({ id });
    ListActions.getCars({ id });
  }, [ListActions])

  const setError = (message) => {
    AuthActions.setError({ form: 'admin', message });
  }

  const validate = {
    carId: carId => {
      if(!isLength(carId, {min: 1})) {
        setError('차량을 선택해 주세요');
        return false;
      }
      return true;
    },
    courseId: courseId => {
      if(!isLength(courseId, { min: 1})) {
        setError('세부 코스를 선택해 주세요');
        return false;
      }
      setError(null);
      return true;
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    ListActions.changeDriverInfo({name: name, value});
  };

  
  const handleRegister = async () => {
    if(error) return; // 현재 에러가 있는 상태라면 진행하지 않음

    if(!validate['carId'](carId)||
       !validate['courseId'](courseId)) return; // 하나라도 실패하면 진행하지 않음

    try {
      await ListActions.activeCourse({courseId, carId}).then(
        result => {
          console.log(result);
          result.data
          ? CustomConsole.correct('인증되었습니다.', `운전자페이지로 이동합니다.`)
          : CustomConsole.error('메인페이지로 이동합니다.')
          history.push('/controller/driver'); // 회원가입 성공시 운전자 페이지로 이동
      });;
    } catch (error) {
      // 에러 처리하기
      if(error.response.status === 409) {
        const message = '에러 발생'
        setError(message);
      }
      setError('알 수 없는 에러가 발생했습니다.')
    }
  }

  return (
    <>
    <LogoWrapper title="Home" >
    </LogoWrapper>
    <Contents>
        <SearchStepper error={error} handleChange={handleChange} sendData={driverInfo} handleRegister={handleRegister} data={ {carList, courseList} }/>
    </Contents>
     </>  
  );
};

export default connect(
  (state) => ({
    error: state.auth.getIn(['admin', 'error']),
    carList: state.list.getIn(['carInfo', 'carList']),
    courseList: state.list.getIn(['courseInfo', 'courseList']),
    driverInfo: state.list.get('driverInfo').toJS()
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
    ListActions: bindActionCreators(listActions, dispatch) 
  })
)(AdminRegister);