import React from "react";
import CardLayout from "./ui/CardLayout";
import moment from "moment";
import { weatherCodesMapping } from "../utils";

export default function SevenDayForecast({ dailyForecast }) {
  return (
    <CardLayout className={`seven-day-forecast-card-layout`}>
      <p className="label-18"> 7 Day Forecast</p>
      {Object.keys(dailyForecast)?.length > 0 &&
        Object.keys(dailyForecast).map((day, dayInd) => {
          return (
            <DayForeCast
              dayData={dailyForecast[day]}
              day={day}
              key={dayInd}
              lastDay={dayInd === 6 ? true : false}
            />
          );
        })}
    </CardLayout>
  );
}

function DayForeCast({ day, dayData, lastDay }) {
  return (
    <div
      className={`flex items-center single-day justify-between ${
        lastDay ? "border-0" : ""
      }`}
    >
      <p style={{ width: "27%" }}>{moment(day).format("dddd")}</p>
      <img
        src={weatherCodesMapping[dayData.weatherCode].img}
        alt="weather data"
        width={48}
        height={48}
      />
      <div
        style={{ width: "62%", marginLeft: "10px" }}
        className="flex items-center justify-between"
      >
        <p className="capitalize">{dayData.weatherCondition}</p>
        <p>
          {Math.floor(dayData.temperature2mMin)} -
          {Math.floor(dayData.temperature2mMax)}℃
        </p>
      </div>
    </div>
  );
}
