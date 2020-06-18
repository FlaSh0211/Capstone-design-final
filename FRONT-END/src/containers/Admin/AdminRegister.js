import React, { useEffect, useState } from 'react';
import { AuthContent, InputWithLabel, AuthButton, AuthError } from 'components/Auth';
import { AdminStepper } from 'components/Admin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'redux/modules/auth';
import * as userActions from 'redux/modules/user';
import storage from 'lib/storage';
import {isEmail, isLength, isAlphanumeric} from 'validator';
import debounce from 'lodash/debounce';
import Axios from 'axios';


function AdminRegister({ form, error, exists, result, AuthActions, UserActions, history }) {
  const { type, name, tell, location, description, certification } = form.toJS();
  const [imgBase64, setImgBase64] = useState(""); // 파일 base64
  const [imgFile, setImgFile] = useState(null);	//파일	
  console.log(imgFile)

  useEffect(() => {

    return () => {
      AuthActions.initializeForm('admin');
    };
  }, [AuthActions]);

  const setError = (message) => {
    AuthActions.setError({ form: 'admin', message });
  }

  const validate = {
    type: value => {
      if(!isAlphanumeric(value) || !isLength(value, { min: 3, max: 15 })) {
        setError('그룹의 형식이 맞지 않습니다.');
        return false;
      }
      return true;
    },
    name: value => {
      if(!isLength(value, { min: 4, max: 15 })) {
        setError('그룹명은 4~15 글자의 문자 혹은 숫자로 이뤄져야 합니다.');
        return false;
      }
      setError(null);
      return true;
    },
    location: value => {
      if(!isLength(value, { min: 4, max: 15 })) {
        setError('location위치는 30자 이내어야 합니다.');
        return false;
      }
      return true;
    },
    description: value => {
      if(!isLength(value, { min: 1, max: 100 })) {
        setError('description은 100자 이내어야 합니다.');
        return false;
      }
      return true;
    },
    certification: value => {
      if(!value) {
        setError('파일을 업로드 해주셔야 합니다.');
        return false;
      } 
      if(value.type !== "image/jpeg" && value.type !== "image/png") {
        setError('파일은 jpeg 혹은 png 포멧만 업로드 가능합니다.');
        return false;
      }
      setError(null);
      return true;
    },
    tell: value => {
      if(!isLength(value, { min: 6 })){
        setError('연락처가 짧거나, "-" 을 빼주세요.');
        return false
      }
      setError(null);
      return true;
    }
  };

  const checkDisplayNameExists = debounce(async displayName => {
    try {
      const result = await AuthActions.checkDisplayNameExists(displayName);
      if(result.data.exists) {
        setError('이미 존재하는 아이디입니다.');
      } else {
        setError(null);
      }
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const handleChange = e => {
    const { name, value } = e.target;
    AuthActions.changeInput({
      name,
      value,
      form: 'admin'
    });
    
    const validation = validate[name](value);
    if(name.indexOf('password') > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침

    checkDisplayNameExists(value);
  };

  const handleChangeFile = async (e) => {
    const { name, files } = e.target;
    let reader = new FileReader();
    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
      }
    }
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      setImgFile(files[0]);
    }
    const validation = validate['certification'](files[0]);
  }

  const handleAdminRegister = async () => {
    if(error) return; // 현재 에러가 있는 상태라면 진행하지 않음

    if(!validate['type'](type)||
      !validate['name'](name)||
      !validate['tell'](tell)||
      !validate['description'](description)||
      !validate['certification'](imgFile)||
      !validate['location'](location)) return; // 하나라도 실패하면 진행하지 않음
    
      let formdata = new FormData();
      formdata.append('certification', imgFile);
      formdata.append('type', type);
      formdata.append('name', name);
      formdata.append('tell', tell);
      formdata.append('description', description);
      formdata.append('location', location);

    try {
      await Axios({
        url: "/api/v1.0/auth/register/admin",
        method: "POST",
        data: formdata
      }).then(
        result => {
          const adminInfo = result.data;
          storage.set('adminInfo', adminInfo);
          UserActions.setAdminInfo(adminInfo);
          UserActions.setValidated(true);
      });;

      history.push('/'); // 회원가입 성공시 홈페이지로 이동
    } catch (error) {
      // 에러 처리하기
      if(error.response.status === 409) {
        const { key } = error.response.data;
        const message = key === 'email' ? '이미 존재하는 이메일입니다.' : '이미 존재하는 아이디입니다.';
        setError(message);
      }
      setError('알 수 없는 에러가 발생했습니다.')
    }
  }

  return (
    <AuthContent title="관리자 신청서">
        <AdminStepper error={error} handleChange={handleChange} form={form.toJS()} handleAdminRegister={handleAdminRegister} handleChangeFile={handleChangeFile} />
        {
          error && <AuthError>{error}</AuthError>
        }
        {/* <AuthButton onClick={handleAdminRegister}>관리자 신청하기</AuthButton> */}
    </AuthContent>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(['admin', 'form']),
    error: state.auth.getIn(['admin', 'error']),
    exists: state.auth.getIn(['admin', 'exists']),
    result: state.auth.get('result')
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(AdminRegister);