import React, { useEffect, useState } from "react";
import CardLayout from "./ui/CardLayout";
import Sun from "../assets/images/sun.svg";
import Tempreature from "../assets/images/temperature.svg";
import Eye from "../assets/images/eye.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Windy from "../assets/images/windy.svg";
import Water from "../assets/images/water.svg";
import Cloud from "../assets/images/cloud.svg";
import Search from "../assets/images/search.svg";
import { weatherCodesMapping } from "../utils";
import moment from "moment";

export default function DefaultScreen({
  currentWeatherData,
  forecastLocation,
  onClickHandler,
}) {
  // console.log(currentWeatherData);

  const [searchCityText, setSearchCityText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const fetchSuggestions = async function (label) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search.php?q=${label}&format=json&addressdetails=1`
    );
    const datas = await response.json();

    const tempSuggestions = [];
    datas.forEach((data) => {
      tempSuggestions.push({
        label: `${data?.name},${data?.address?.state},${data?.address.country}`,
        lat: data.lat,
        lon: data.lon,
      });
    });
    setSuggestions(tempSuggestions);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuggestions(searchCityText);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchCityText]);

  return (
    <div className="home-main-div">
      <div className="default-home-container">
        <CardLayout>
          {currentWeatherData?.length && currentWeatherData[0] && (
            <>
              {/* place,sunny,day and date */}
              <div className="default-card-city">
                <img
                  src={
                    weatherCodesMapping[
                      currentWeatherData[0]?.value?.weatherCode
                    ].img
                  }
                  alt="Sunny"
                />

                <div>
                  <p className="city-name">{forecastLocation?.label}</p>
                  <p className="date-today">
                    {moment().format("dddd DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              {/* Temp container */}

              <div className="temp-container">
                <img src={Tempreature} alt="thermometer image" />
                <div>
                  <p style={{ fontSize: "144px" }}>
                    {parseFloat(
                      currentWeatherData[0].value.temperature2m
                    ).toFixed(0)}
                  </p>
                  <p className="text-captalize">
                    {currentWeatherData[0].value.weatherCondition}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "24px",
                    paddingTop: "45px",
                    alignSelf: "start",
                  }}
                >
                  ℃
                </p>
              </div>
              {/*visibility and feels like */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "60px",
                  width: "100%",
                  columnGap: "16px",
                }}
              >
                <div className="weather-info-subtitle">
                  <div className="flex">
                    <img src={Eye} alt="" />
                    <p className="weather-params-label">Visibility</p>
                  </div>
                  <p>
                    {(
                      Math.floor(currentWeatherData[0].value?.visibility) / 1000
                    ).toFixed(0)}{" "}
                    km
                  </p>
                </div>
                <p>|</p>
                <div className="weather-info-subtitle">
                  <div className="flex">
                    <img src={ThermoMini} alt="" />
                    <p className="weather-params-label">Feels Like</p>
                  </div>
                  <p>
                    {Math.floor(
                      currentWeatherData[0].value?.apparentTemperature
                    )}{" "}
                    °C
                  </p>
                </div>
              </div>

              {/* Humidity and wind */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "24px",
                  width: "100%",
                  columnGap: "16px",
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
                    {Math.floor(currentWeatherData[0].value?.windSpeed)} km/h
                  </p>
                </div>
              </div>
            </>
          )}
        </CardLayout>

        {/* search card layout */}

        <CardLayout>
          <div className="search-card">
            {/* cloud image */}
            <div className="flex justify-center">
              <img src={Cloud} alt="cloud image" />
            </div>
            {/* search input tag */}
            <div className="search-city-container city-results">
              <img src={Search} />
              <input
                type="text"
                className="city-input"
                placeholder="Search City"
                value={searchCityText}
                onChange={(e) => setSearchCityText(e.target.value)}
              />
            </div>
            {/* suggestions */}
            <div className="search-city-suggestions">
              {suggestions?.length > 0 &&
                suggestions.map((suggestionItem, suggestionIndex) =>
                  suggestionIndex < 4 ? (
                    <p
                      className="suggested-label"
                      key={suggestionIndex}
                      onClick={() => onClickHandler(suggestionItem)}
                    >
                      {suggestionItem.label}
                    </p>
                  ) : null
                )}
            </div>
          </div>
        </CardLayout>
      </div>
    </div>
  );
}
