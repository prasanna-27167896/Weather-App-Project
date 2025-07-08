import React from "react";
import CardLayout from "./ui/CardLayout";
import Location from "../assets/images/location.svg";
import Tempreature from "../assets/images/temperature.svg";
import Eye from "../assets/images/eye.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Windy from "../assets/images/windy.svg";
import Water from "../assets/images/water.svg";
import DayForecastCard from "./ui/DayForecastCard";
import { weatherCodesMapping } from "../utils";
import moment from "moment";
import HourlyForecast from "./HourlyForecast";
import UnitMetrixComp from "./UnitMetrixComp";
import SevenDayForecast from "./SevenDayForecast";
import TempGraph from "./TempGraph";

export default function SearchResult({
  forecastLocation,
  dailyForecast,
  hourlyForecast,
  currentWeatherData,
}) {
  return (
    <div className="search-result-container-div">
      <p className="forecast-title text-capitalize">
        {currentWeatherData[0]?.value?.weatherCondition}
      </p>
      <CardLayout>
        <div className="flex items-center justify-between">
          <div style={{ width: "30%" }}>
            <img
              src={
                weatherCodesMapping[currentWeatherData[0].value.weatherCode].img
              }
              alt="Weather Image"
              width={48}
              height={48}
            />
            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{forecastLocation?.label}</p>
            </div>
            <p className="text-blue" style={{ paddingLeft: "30px" }}>
              Today's {moment(currentWeatherData[0].date).format("MMM DD")}
            </p>
          </div>
          <div className="temp-container" style={{ width: "auto" }}>
            <img
              src={Tempreature}
              className="thermometer-img"
              alt="thermometer image"
            />
            <div>
              <p style={{ fontSize: "144px" }}>
                {parseFloat(currentWeatherData[0].value?.temperature2m).toFixed(
                  0
                )}
              </p>
              <p>{currentWeatherData[0]?.value?.weatherCondition}</p>
            </div>
            <p
              style={{
                fontSize: "24px",
                alignSelf: "start",
                paddingTop: "45px",
              }}
            >
              °C
            </p>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
              }}
            >
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Eye} alt="an eye" />
                  <p className="weather-params-label">Visibility</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0].value?.visibility / 1000)}{" "}
                  km
                </p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={ThermoMini} />
                  <p className="weather-params-label">Feels Like</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0].value?.apparentTemperature)}
                  °C
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
                marginTop: "24px",
              }}
            >
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Water} />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{currentWeatherData[0].value?.humidity}%</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Windy} />
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0].value?.windSpeed)} km/hr
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>

      <div className="flex justify-between" style={{ marginTop: "24px" }}>
        <HourlyForecast hourlyData={hourlyForecast} />
      </div>
      <div className="flex items-center" style={{ columnGap: "20px" }}>
        <div className="current-time-metrix">
          <CardLayout className="unit-metrix">
            <div className="unit-metrix-container" style={{ marginTop: "0px" }}>
              <UnitMetrixComp
                label="Temperature"
                value={Math.floor(currentWeatherData[0]?.value?.temperature2m)}
                unit="°C"
              />
              <UnitMetrixComp
                label="Wind"
                value={Math.floor(currentWeatherData[0]?.value?.windSpeed)}
                unit="km/hr"
              />
            </div>
            <div className="unit-metrix-container">
              <UnitMetrixComp
                label="Humidity"
                value={Math.floor(currentWeatherData[0]?.value?.humidity)}
                unit="%"
              />
              <UnitMetrixComp
                label="Visibility"
                value={
                  Math.floor(currentWeatherData[0]?.value?.visibility) / 1000
                }
                unit="km"
              />
            </div>
            <div className="unit-metrix-container">
              <UnitMetrixComp
                label="Feels Like"
                value={Math.floor(
                  currentWeatherData[0]?.value?.apparentTemperature
                )}
                unit="°C"
              />
              <UnitMetrixComp
                label="Chance of Rain"
                value={Math.floor(
                  currentWeatherData[0]?.value?.precipitation_probability
                )}
                unit="mm"
              />
            </div>
            <div className="unit-metrix-container">
              <UnitMetrixComp
                label="Pressure"
                value={Math.floor(
                  currentWeatherData[0]?.value?.surfacePressure
                )}
                unit="hpa"
              />

              <UnitMetrixComp
                label="Cloud Cover"
                value={Math.floor(currentWeatherData[0]?.value?.cloudCover)}
                unit="%"
              />
            </div>
          </CardLayout>
        </div>
        <SevenDayForecast dailyForecast={dailyForecast} />
      </div>
      <TempGraph hourlyData={hourlyForecast} />
    </div>
  );
}
