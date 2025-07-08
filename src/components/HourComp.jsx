import React from "react";
import moment from "moment";
import { weatherCodesMapping } from "../utils";
import ArrowLeft from "../assets/images/arrow-left.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import ArrowStraight from "../assets/images/arrow-straight.svg";
import VerticalLine from "../assets/images/vartical-line.svg";

export default function HourComp({ currentTime, data }) {
  return (
    <>
      <div
        className={`hour-comp-main-div ${currentTime ? "time-highlight" : ""}`}
      >
        <p className="label-18">
          {currentTime ? "Now" : moment(data.date).format("HH:mm")}
        </p>
        <img
          src={weatherCodesMapping[data?.value?.weatherCode].img}
          width={48}
          height={48}
        />
        <p className="label-18">{Math.floor(data?.value?.temperature2m)}°C</p>
        <img
          src={
            Math.floor(data?.value?.windDirection10m) < 90 ||
            Math.floor(data?.value?.windDirection10m) > 270
              ? ArrowRight
              : Math.floor(data?.value?.windDirection10m) > 90 ||
                Math.floor(data?.value?.windDirection10m) < 270
              ? ArrowLeft
              : ArrowStraight
          }
        />
        <p className="label-18">{Math.floor(data?.value?.windSpeed)} km/hr</p>
      </div>
      <img src={VerticalLine} />
    </>
  );
}
