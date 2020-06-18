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

export default function Step1({handleChange, form}) {
  const { type, name, tell } = form;
  return (
    <>
      <SlideBtn handleChange={handleChange} type={type}/>
      <InputWithLabel label="단체/학원이름" name="name" placeholder="학원이름" onChange={handleChange} value={name}/>
      <InputWithLabel label="단체 연락처" name="tell" placeholder="010-1234-5678" onChange={handleChange} value={tell}/>
    </>
  )
}

// <InputWithLabel label="단체유형" name="groupType" placeholder="단체유형"/>
const SlideBtn = ({handleChange, type}) => {
  const classes = useStyles();

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
        단체유형
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        name="type"
        value={type}
        onChange={handleChange}
        labelWidth={labelWidth}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Academy"}>학원</MenuItem>
        <MenuItem value={"kindergarden"}>유치원</MenuItem>
        <MenuItem value={"school"}>학교</MenuItem>
        <MenuItem value={"etc"}>기타</MenuItem>
      </Select>
    </FormControl>
  )
}