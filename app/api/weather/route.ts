import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error('Weather API key is not configured.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required.' }, { status: 400 });
  }

  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;

  try {
    const weatherResponse = await fetch(apiUrl);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      console.error('Weather API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch weather data.' }, { status: weatherResponse.status });
    }

    const weatherData = await weatherResponse.json();

    // Reformat data to match the structure your dashboard expects
    const formattedData = {
      current: {
        temp: weatherData.current.temp_c,
        feelsLike: weatherData.current.feelslike_c,
        condition: weatherData.current.condition.text,
        humidity: weatherData.current.humidity,
        wind: weatherData.current.wind_kph,
      },
      forecast: weatherData.forecast.forecastday.map((day: any) => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: day.day.maxtemp_c,
        low: day.day.mintemp_c,
        condition: day.day.condition.text,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Internal server error fetching weather:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}