import React, { useEffect, useState } from "react";
import Header from "./components/header";
import "./style/index.css";
import DefaultScreen from "./components/DefaultScreen";
import { fetchWeatherApi } from "openmeteo";
import { weatherCodesMapping } from "./utils";
import SearchResult from "./components/SearchResult";

export default function App() {
  const [dailyForecast, setDailyForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [showResultScreen, setShowResultScreen] = useState(false);

  const [dataLoading, setDataLoading] = useState(false);
  const [forecastLocation, setForecastLocation] = useState({
    label: "London",
    lat: 51.5085,
    lon: -0.1257,
  });

  //To convert the data into desired format

  function filterAndFlagClosestTime(data) {
    const currentDate = new Date(); //Date Format
    const entries = Object.entries(data);
    // entries = [[hourlyTime,{properties}],[12:30pm(24th april),{}]...]
    // console.log(entries);
    const todayData = entries.filter(([dateString]) => {
      const date = new Date(dateString); // converting string value to Date
      return (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });
    // console.log(todayData); //19 datas
    let closestTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]));
    let closestTimeIndex = 0;
    // console.log(closestTimeDiff);

    //Find the closest time from the current time
    todayData.forEach(([dateString], index) => {
      const timeDiff = Math.abs(currentDate - new Date(dateString));

      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        closestTimeIndex = index;
      }
      // console.log(closestTimeDiff);
      // console.log(closestTimeIndex);
    });

    //Add a flag to the closest time entry
    const result = todayData.map(([dateString, value], index) => ({
      date: dateString,
      value,
      isClosestTime: index === closestTimeIndex,
    }));
    // console.log(result);
    return result;
  }

  function processData(hourly, daily) {
    function convertTimeToObjectArray(times, values) {
      //Early returm if no data
      if (!times || !values || !values.weatherCode) {
        return {};
      }
      const obj = {};
      //Times is an array,so we want to distribute the data inside, into one object a/c to the time
      times.forEach((time, timeIndex) => {
        //Skip if time is null/undefined
        if (!time) return;
        const weatherProperties = {};

        Object.keys(values).forEach((property) => {
          if (values[property] && values[property][timeIndex] !== undefined) {
            weatherProperties[property] = values[property][timeIndex];
          }
        });

        const weatherCode = values.weatherCode[timeIndex];
        const weatherCondition = weatherCodesMapping[weatherCode]?.label;

        obj[time] = {
          ...weatherProperties,
          weatherCondition,
        };
      });
      return obj;
    }
    //convertTimeToObjectArray(daily.time,{weathcode:[],temp:[],wind:[],rainfall:[]});
    const dailyData = convertTimeToObjectArray(daily.time, {
      weatherCode: daily.weatherCode,
      temperature2mMax: daily.temperature2mMax,
      temperature2mMin: daily.temperature2mMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      uvIndexMax: daily.uvIndexMax,
      precipitationSum: daily.precipitationSum,
      windSpeed10mMax: daily.windSpeed10mMax,
      windDirection10mDominant: daily.windDirection10mDominant,
    });

    const hourlyFormatted = convertTimeToObjectArray(hourly.time, {
      temperature2m: hourly.temperature2m,
      visibility: hourly.visibility,
      windDirection10m: hourly.windDirection10m,
      apparentTemperature: hourly.apparentTemperature,
      precipitation_probability: hourly.precipitation_probability,
      humidity: hourly.humidity,
      windSpeed: hourly.windSpeed,
      weatherCode: hourly.weatherCode,
      surfacePressure: hourly.surfacePressure,
      cloudCover: hourly.cloudCover,
    });
    const hourlyData = filterAndFlagClosestTime(hourlyFormatted);

    return { hourlyData, dailyData };
  }

  const fetchWeather = async (lat, lon, switchToResultScreen) => {
    const params = {
      latitude: lat ?? 51.5085,
      longitude: lon ?? -0.1257,
      hourly: [
        "temperature_2m",
        "weather_code",
        "visibility",
        "wind_direction_10m",
        "apparent_temperature",
        "precipitation_probability",
        "relative_humidity_2m",
        "wind_speed_10m",
        "cloud_cover",
        "surface_pressure",
      ],

      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunset",
        "uv_index_max",
        "precipitation_sum",
        "wind_speed_10m_max",
        "winddirection_10m_dominant",
        "sunrise",
      ],
      timezone: "auto",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    // console.log(response);

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly();
    const daily = response.daily();

    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        weatherCode: hourly.variables(1).valuesArray(),
        visibility: hourly.variables(2).valuesArray(),
        windDirection10m: hourly.variables(3).valuesArray(),
        apparentTemperature: hourly.variables(4).valuesArray(),
        precipitation_probability: hourly.variables(5).valuesArray(),
        humidity: hourly.variables(6).valuesArray(),
        windSpeed: hourly.variables(7).valuesArray(),

        cloudCover: hourly.variables(8).valuesArray(),
        surfacePressure: hourly.variables(9).valuesArray(),
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        weatherCode: daily.variables(0).valuesArray(),
        temperature2mMax: daily.variables(1).valuesArray(),
        temperature2mMin: daily.variables(2).valuesArray(),
        apparentTemperatureMax: daily.variables(3).valuesArray(),
        apparentTemperatureMin: daily.variables(4).valuesArray(),
        uvIndexMax: daily.variables(6).valuesArray(),
        precipitationSum: daily.variables(7).valuesArray(),
        windSpeed10mMax: daily.variables(8).valuesArray(),
        windDirection10mDominant: daily.variables(9).valuesArray(),
      },
    };

    const { hourlyData, dailyData } = processData(
      weatherData.hourly,
      weatherData.daily
    );

    setHourlyForecast(hourlyData);
    console.log(hourlyData);

    setDailyForecast(dailyData);
    setDataLoading(false);
    if (switchToResultScreen) {
      setShowResultScreen(true);
    }
  };

  useEffect(function () {
    setDataLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Extract latitude and longitude from the position object
        const { latitude, longitude } = position.coords;
        // console.log(position.coords);
        fetch(
          `https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=18&format=jsonv2`
        )
          .then((response) => response.json())
          .then((location) => {
            setForecastLocation({
              label: `${
                location?.address?.city ?? location?.address?.village
              },${location?.address?.state},${location?.address?.country}`,
              lat: location?.lat,
              lon: location?.lon,
            });
            fetchWeather(location.lat, location.lon);
          });
      });
    } else {
      fetchWeather();
    }
  }, []);

  const clickHandler = (searchItem) => {
    setDataLoading(true);
    setForecastLocation({
      label: searchItem.label,
      lat: searchItem.lat,
      lon: searchItem.lon,
    });
    // console.log(searchItem.label);
    fetchWeather(searchItem.lat, searchItem.lon, true);
  };

  return (
    <div className="app">
      <Header />
      {!dataLoading && !showResultScreen && (
        <DefaultScreen
          currentWeatherData={
            hourlyForecast?.length
              ? hourlyForecast.filter((hour) => hour.isClosestTime)
              : []
          }
          forecastLocation={forecastLocation}
          onClickHandler={clickHandler}
        />
      )}

      {showResultScreen && !dataLoading && (
        <SearchResult
          currentWeatherData={
            hourlyForecast?.length
              ? hourlyForecast.filter((hour) => hour.isClosestTime)
              : []
          }
          dailyForecast={dailyForecast}
          forecastLocation={forecastLocation}
          hourlyForecast={hourlyForecast}
        />
      )}

      <p className="copyright-text">&copy; 2025 WSA. All Rights Reserved</p>
    </div>
  );
}
