import React from 'react';
import { InputWithLabel } from 'components/Auth';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const carList = {
  groupInfo: {
      users: [],
      drivers: [
          "5e8424fddd727b8885616051",
          "5e842525dd727b8885616052"
      ],
      _id: "5e842681dd727b8885616053",
      rooms: [],
      type: "Academy",
      name: "asdasdasd",
      tell: "01040247797",
      location: "incheonaaa",
      description: "aaaaaaaaa",
      certification: "asdddddddd",
      createdAt: "2020-04-01T05:28:33.999Z",
      __v: 0
  },
  carList: [
      {
          _id: "5eaef199d48f0d2ecc96596b",
          carName: "마티즈",
          carNumber: "13가1234",
          seatNumber: "3",
          inspectionDate: "2020-01-01T00:00:00.000Z",
          carImageUrl: "uploads\\car\\gorilla-logo1588052827549.png",
          group: "5e842681dd727b8885616053",
          createdAt: "2020-04-23T12:06:03.160Z",
          __v: 0
      },
      {
          _id: "5eaef199d48f0d2ecc96596b",
          carName: "마티즈",
          carNumber: "13가1234",
          seatNumber: "2",
          inspectionDate: "2020-01-01T00:00:00.000Z",
          carImageUrl: "uploads\\car\\banner1587651770202.jpg",
          group: "5e842681dd727b8885616053",
          createdAt: "2020-04-23T14:22:50.278Z",
          __v: 0
      }
  ]
} 
const imgParser = ({imageUrl}) => {
  let imgUrl = 'http://localhost:4000/api';
  const parsing = imageUrl.split('\\');
  for(const i in parsing) {
    imgUrl += '/'+parsing[i]
  }
  return imgUrl;
};

export default function Step1({handleChange, sendData, carList}) {
  const { carId } = sendData;
  return (
    <>
      <SlideBtn handleChange={handleChange} carId={carId} carList={carList}/>
    </>
  )
}

// <InputWithLabel label="단체유형" name="groupType" placeholder="단체유형"/>
const SlideBtn = ({handleChange, carId, carList}) => {
  const classes = useStyles();

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
        차량 선택
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        name="carId"
        value={carId}
        onChange={handleChange}
        labelWidth={labelWidth}
      >
        {
          carList.map(car => (
            <MenuItem value={car._id}>
              <span>{car.carName+" | "+car.carNumber}</span>
              <span><img width="20%" src={imgParser({imageUrl: car.carImageUrl})} /></span>
            </MenuItem>
            )
          )
        }
      </Select>
    </FormControl>
  )
}