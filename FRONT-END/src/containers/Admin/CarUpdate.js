import React, { useEffect, useState } from 'react';
import { AuthContent, InputWithLabel, AuthButton, RightAlignedLink, AuthError } from 'components/Auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'redux/modules/auth';
import * as userActions from 'redux/modules/user';
import * as listActions from 'redux/modules/list';
import storage from 'lib/storage';
import {isInt, isLength} from 'validator';
import Axios from 'axios';


function CarUpdate({ form, error, result, AuthActions, UserActions, match, history, ListActions }) {

  const { carName, carNumber, seatNumber, inspectionDate } = form.toJS();
  const [imgBase64, setImgBase64] = useState(""); // 파일 base64
  const [imgFile, setImgFile] = useState(null); //파일
  const id = match.params.id;
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    console.log("result",result);
    if(result.car) {
      storage.set('car', result)
    }
    else {
      history.push('/admin/cars');

    }
    const car = storage.get('car')
    setImageUrl(car.car.carImageUrl);
    AuthActions.setCar(car);

    return () => {
      AuthActions.initializeForm('car');
    };
  }, []);
 
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
      // 검증조건 기입해야 함.
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

  const handleChangeFile = (e) => {
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
  }

  const handleCarRegister = async () => {
    if(error) return; // 현재 에러가 있는 상태라면 진행하지 않음
    console.log(imgFile)
    if(!validate['carName'](carName)||
      !validate['carNumber'](carNumber)||
      !validate['seatNumber'](seatNumber)||
      !validate['inspectionDate'](inspectionDate)) return; // 하나라도 실패하면 진행하지 않음
    
    let formdata = new FormData();
    formdata.append('carId', id);
    formdata.append('carImage', imgFile);
    formdata.append('carName', carName);
    formdata.append('carNumber', carNumber);
    formdata.append('seatNumber', seatNumber);
    formdata.append('inspectionDate', inspectionDate);
   
    

    try {
      await Axios({
        url: "/api/v1.0/admin/car",
        method: "PUT",
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
    <AuthContent title="차량수정">
        <InputWithLabel value={carName} label="차종이름" name="carName" placeholder="ex)마티즈" onChange={handleChange} />
        <InputWithLabel value={carNumber} label="차량번호" name="carNumber" placeholder="ex)13가0000" onChange={handleChange} />
        <InputWithLabel value={seatNumber} label="좌석수" name="seatNumber" placeholder="좌석수" type="number" onChange={handleChange} />
        <InputWithLabel value={inspectionDate} label="최종점검날짜" name="inspectionDate" placeholder="점검날짜" type="date" onChange={handleChange} />
        <InputWithLabel 
          label={<p>이전 사진: <img style= {{width: '100px'}} src= {'http://localhost:4000/api/'+ imageUrl}/></p>} 
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
        <AuthButton onClick={handleCarRegister}>수정하기</AuthButton>
    </AuthContent>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(['car', 'form']),
    error: state.auth.getIn(['car', 'error']),
    result: state.list.get('result').toJS()

    
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
    ListActions: bindActionCreators(listActions, dispatch)
  })
)(CarUpdate);