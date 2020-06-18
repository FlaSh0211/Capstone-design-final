import React, { useEffect, useState } from 'react';
import { AuthContent, InputWithLabel, AuthButton, RightAlignedLink, AuthError } from 'components/Auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'redux/modules/auth';
import * as userActions from 'redux/modules/user';
import storage from 'lib/storage';
import {isInt, isLength} from 'validator';
import Axios from 'axios';


function CarRegister({ form, error, result, AuthActions, UserActions, history }) {
  const { carName, carNumber, seatNumber, inspectionDate } = form.toJS();
  const [imgBase64, setImgBase64] = useState(""); // 파일 base64
  const [imgFile, setImgFile] = useState(null);	//파일	
  console.log(imgFile)
  useEffect(() => {
    return () => {
      AuthActions.initializeForm('car');
    };
  }, [AuthActions]);

  const setError = (message) => {
    AuthActions.setError({ form: 'car', message });
  }

  const validate = {
    carName: value => {
      if(!isLength(value, { min: 2, max: 15 })) {
        setError('차종은 4~15 글자의 문자 혹은 숫자로 이뤄져야 합니다.');
        return false;
      }
      setError(null);
      return true;
    },
    carNumber: value => {
      if(!isLength(value, { min: 4, max: 15 })) {
        setError('차번호는 4~15 글자의 문자 혹은 숫자로 이뤄져야 합니다.');
        return false;
      }
      setError(null);
      return true;
    },
    seatNumber: value => {
      if(!isInt(value)) {
        setError('좌석수는 숫자로 기입해주셔야 합니다.');
        return false;
      }
      setError(null);
      return true;
    },
    inspectionDate: value => {
      const today = new Date().toLocaleDateString().split('.');
      const input = value.split('-');

      if(value==='') {
        setError('최종점검일을 기입해주셔야 합니다.');
        return false;
      }

      if(parseInt(today[0])<parseInt(input[0])){
        setError('오늘 날짜 이전을 선택해주세요.');
        return false;
      } else if(parseInt(today[0])==parseInt(input[0])) {
        if(parseInt(today[1])<parseInt(input[1])){
          setError('오늘 날짜 이전을 선택해주세요.');
          return false;
        } else if(parseInt(today[1])==parseInt(input[1])) {
          if(parseInt(today[2])<parseInt(input[2])){
            setError('오늘 날짜 이전을 선택해주세요.');
            return false;
          }
        }
      }
      setError(null);
      return true;
    },
    carImage: value => {
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
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    AuthActions.changeInput({
      name,
      value,
      form: 'car'
    });
    
    const validation = validate[name](value);
    if(name.indexOf('inspectionDate') > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침
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
    const validation = validate['carImage'](files[0]);
  }

  const handleCarRegister = async () => {
    if(error) return; // 현재 에러가 있는 상태라면 진행하지 않음
    if(!validate['carName'](carName)||
      !validate['carNumber'](carNumber)||
      !validate['carImage'](imgFile)||
      !validate['inspectionDate'](inspectionDate)) return; // 하나라도 실패하면 진행하지 않음
    
    let formdata = new FormData();
    formdata.append('carImage', imgFile);
    formdata.append('carName', carName);
    formdata.append('carNumber', carNumber);
    formdata.append('seatNumber', seatNumber);
    formdata.append('inspectionDate', inspectionDate);
    

    try {
      await Axios({
        url: "/api/v1.0/admin/car/register",
        method: "POST",
        data: formdata
      });

      history.push('/'); // 회원가입 성공시 홈페이지로 이동
    } catch (error) {
      // 에러 처리하기
      if(error.response.status === 409) {
        setError('서버에러 발생');
      }
      setError('알 수 없는 에러가 발생했습니다.')
    }
  }
  return (
    <AuthContent title="차량등록">
        <InputWithLabel value={carName} label="차종이름" name="carName" placeholder="ex)마티즈" onChange={handleChange} />
        <InputWithLabel value={carNumber} label="차량번호" name="carNumber" placeholder="ex)13가0000" onChange={handleChange} />
        <InputWithLabel value={seatNumber} label="좌석수" name="seatNumber" placeholder="좌석수" type="number" onChange={handleChange} />
        <InputWithLabel value={inspectionDate} label="최종점검날짜" name="inspectionDate" placeholder="점검날짜" type="date" onChange={handleChange} />
        <InputWithLabel 
          label="차량이미지" 
          name="carImage" 
          placeholder="image파일만 업로드가 가능합니다." 
          type="file" 
          enctype="multipart/form-data" 
          accept="img/*"
          onChange={handleChangeFile} 
        />
        {
          error && <AuthError>{error}</AuthError>
        }
        <AuthButton onClick={handleCarRegister}>등록하기</AuthButton>
    </AuthContent>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(['car', 'form']),
    error: state.auth.getIn(['car', 'error']),
    result: state.auth.get('result')
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(CarRegister);