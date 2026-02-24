import { NextResponse } from "next/server";

const OWM_API_URL = "https://api.openweathermap.org/data/3.0/onecall";

// Córdoba, Argentina
const LAT = -31.4135;
const LON = -64.1811;

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  uvi: number;
  wind_speed: number;
  visibility: number;
  description: string;
  icon: string;
  dt: number;
}

export interface WeatherResponse {
  data: WeatherData;
  fetchedAt: string;
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenWeatherMap API key not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `${OWM_API_URL}?lat=${LAT}&lon=${LON}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 600 }, // cache 10 minutes server-side
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenWeatherMap API error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Failed to fetch weather data from OpenWeatherMap" },
        { status: response.status }
      );
    }

    const json = await response.json();
    const current = json.current;

    const result: WeatherResponse = {
      data: {
        temp: current.temp,
        feels_like: current.feels_like,
        humidity: current.humidity,
        uvi: current.uvi,
        wind_speed: current.wind_speed,
        visibility: current.visibility,
        description: current.weather?.[0]?.description ?? "N/A",
        icon: current.weather?.[0]?.icon ?? "01d",
        dt: current.dt,
      },
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching weather data" },
      { status: 500 }
    );
  }
}
