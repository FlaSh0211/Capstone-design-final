import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    height: (props) => props.height,
    justifyContent: "center",
    margin: "0 auto",
  },
  margin: {
    height: theme.spacing(3),
  },
  padding: 0,
}));


const Bedge = ({ stationName }) => (
  <IconButton aria-label="cart">
    <LocationOnIcon style={{ transform: "rotate( 90deg )", marginLeft: -15 }} />
    <Typography
      style={{ fontSize: "0.7rem", color: "black", fontWeight: "bold" }}
    >
      {stationName}
    </Typography>
  </IconButton>
);

const CourseSlider = withStyles({
  root: {
    color: "#3880ff",
    height: 2,
    padding: "15px 0",
  },
  rail: {
    backgroundColor: "#08088A",
    opacity: 4,
  },
  mark: {
    backgroundColor: "gray",
    width: 8,
    marginLeft: -3,
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    boxShadow:
      "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
    marginTop: -14,
    marginLeft: -14,
    "&:focus, &:hover, &$active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow:
          "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      },
    },
  },
  valueLabel: {
    left: "calc(-50% + 12px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000",
    },
  },
})(Slider);

export default function Sliders({
  subContent,
  active,
  distPer,
  nextStation,
  driverLoc,
  data
}) {
  console.log(data,"위경도")

  const barLength = { height: 100 * subContent.length };
  const classes = useStyles(barLength);
  const len = Math.round(100 / (subContent.length - 1));
  const courselist = subContent;
  const stations = courselist.map((obj) => obj.stationName);
  const [percent, setPercent] = useState(100);
  
  let currentStation;
  let realNextStation;
  let [mark, setMarks] = useState([]);
  let [courselen, setCourseLen] = useState(0);
  let currentIndex;
  let index = -1

  // 다음 스테이션 이름 찾는 부분
  for (let i in courselist) {
    index = index+1;
    if (courselist[i].stationName === nextStation) {
      realNextStation = courselist[parseInt(i) + 1];
      currentStation = courselist[i];
      currentIndex = index;
    }
  }
  function carThumbComponent(props) {
    if (active) {
      return (
        <>
          <span {...props}>
          <span style={{ color: "black", fontWeight: "bold" , fontSize: 12}}>{distPer != null? "곧도착": "운행중"}</span>
            <span style={{ marginRight: 10}}>
              <DriveEtaIcon style={{ color: "#FE2E2E" }} />
            </span>
          </span>
        </>
      );
    }
    else {
      return (
        <>
          <span {...props}>
          <span style={{ color: "black", fontWeight: "bold" , fontSize: 12}}>운행안함</span>
            <span style={{ marginRight: 10}}>
              <DriveEtaIcon style={{ color: "#FE2E2E" }} />
            </span>
          </span>
        </>
      );
    }
  }
  console.log(distPer,'코스리')
  const currentMark = (currentIndex,len)=>{
    // 근접한 정류장에 곧 도착
    if (distPer != null){
      return ( 100-(currentIndex*len))
    }
    // 정류장 사이를 운행 중
    else {
      return (calDistance(data, courselist[0], courselist[courselist.length-1]))
    }
  }
  // 역간거리 퍼센테이지 계산 함수
  const calDistance = (currentLoc, firstStation, lastStation) => {
    if (firstStation != undefined && currentLoc != undefined) {
      let x1 = parseFloat(currentLoc.longitude);
      let y1 = parseFloat(currentLoc.latitude);
      let x2 = parseFloat(firstStation.longitude);
      let y2 = parseFloat(firstStation.latitude);
      let x3 = parseFloat(lastStation.longitude);
      let y3 = parseFloat(lastStation.latitude);

      let x = ((Math.cos(x2) * 6400 * 2 * 3.14) / 360) * Math.abs(y2 - y3);
      let y = 111 * Math.abs(x2 - x3);
      let sum = Math.pow(x, 2) + Math.pow(y, 2);
      console.log(Math.sqrt(sum), "전체코스 길이");

      let X = ((Math.cos(x1) * 6400 * 2 * 3.14) / 360) * Math.abs(y1 - y2);
      let Y = 111 * Math.abs(x1 - x2);
      let SUM = Math.pow(X, 2) + Math.pow(Y, 2);
      console.log(Math.sqrt(SUM), "지금까지 운행한 길이");
      return (100 - ((SUM/sum)*100))
    }
  };
  console.log(calDistance(data, courselist[0], courselist[courselist.length-1]),'결과')
  console.log("11111111111111111111111111111111111111111111111");
  console.log(nextStation, "현재 경유중인 정류장이라고 서버에서 받은거");
  console.log(currentStation, realNextStation, " 경유중 / 다음 정류장");
  console.log(
  );

  // mark상 역간 거리 계산 함수
  const calculate = () => {
    setPercent(percent - len);
    return percent;
  };
  // station을 반환해줌
  const stationName = () => {
    setCourseLen(courselen + 1);
    return stations[courselen];
  };

  useEffect(() => {
    if (percent >= 0) {
      stations.map((obj) => {
        setMarks([
          ...mark,
          {
            value: calculate(),
            label: <Bedge stationName={stationName()} />,
          },
        ]);
      });
    }
  }, [percent]);
  console.log(currentMark(currentIndex,len),'aaaa')
  return (
    <div className={classes.root}>
      <CourseSlider
        orientation="vertical"
        aria-label="123"
        aria-labelledby="vertical-slider"
        marks={mark}
        ThumbComponent={carThumbComponent}
        disabled="true"
        value={currentMark(currentIndex,len)}
        valueLabelDisplay="on"
      />
    </div>
  );
}
