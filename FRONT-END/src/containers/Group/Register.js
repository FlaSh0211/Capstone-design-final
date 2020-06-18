import React, { useEffect } from 'react';
import { AuthContent, InputWithLabel, AuthButton, RightAlignedLink, AuthError } from 'components/Auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'redux/modules/auth';
import * as listActions from 'redux/modules/list';
import storage from 'lib/storage';
import {isEmail, isLength, isAlphanumeric} from 'validator';
import debounce from 'lodash/debounce';


function Register({ form, error, exists, result, AuthActions, ListActions, history, match }) {
  const { email, familyEmail, displayName, password, passwordConfirm } = form.toJS();
  const { id } = match.params;

  useEffect(() => {
    return () => {
      AuthActions.initializeForm('register');
    };
  }, [AuthActions]);

  /*
    Version 2.0에서 개선되어야 함.
    임시로 현재는 가입시 바로 등록되어지도록 설정함 
    그 함수가 아래임
  */
  useEffect(() => {
    ListActions.groupRegister({groupId: id});
    history.push(`/search/result/${id}`);
  }, [ListActions, history, id])


  return (
    <AuthContent title="회원가입">
        <InputWithLabel value={familyEmail} label="보호자 이메일" name="familyEmail" placeholder="이메일" />
        <InputWithLabel value={email} label="이메일(*필수)" name="email" placeholder="이메일" />
        <InputWithLabel value={displayName} label="닉네임(*필수)" name="displayName" placeholder="닉네임" />
        <InputWithLabel value={password} label="비밀번호(*필수)" name="password" placeholder="비밀번호" type="password" />
        <InputWithLabel value={passwordConfirm} label="비밀번호 확인(*필수)" name="passwordConfirm" placeholder="비밀번호 확인" type="password" />
        {
          error && <AuthError>{error}</AuthError>
        }
        <AuthButton >회원가입</AuthButton>
        <RightAlignedLink to="/auth/login">로그인</RightAlignedLink>
    </AuthContent>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(['register', 'form']),
    error: state.auth.getIn(['register', 'error']),
    exists: state.auth.getIn(['register', 'exists']),
    result: state.auth.get('result')
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    ListActions: bindActionCreators(listActions, dispatch),
  })
)(Register);