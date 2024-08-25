'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const cities = [
  { value: 'London', label: 'London' },
  { value: 'New York', label: 'New York' },
  { value: 'Paris', label: 'Paris' },
  { value: 'Tokyo', label: 'Tokyo' },
  // Add more cities or fetch from an API
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      fetchWeather();
    }
  }, [selectedCity]);

  const fetchCitySuggestions = async (inputValue) => {
    try {
      const response = await axios.get(`https://api.example.com/cities?query=${inputValue}`);
      const cities = response.data.map(city => ({ value: city.name, label: city.name }));
      setOptions(cities);
    } catch (err) {
      console.error('Failed to fetch city suggestions', err);
    }
  };

  const fetchWeather = async () => {
    setError(null);
    setWeather(null);

    if (!selectedCity) return;

    try {
      const response = await fetch(`/api/weather?city=${selectedCity.value}`);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 p-6">
      <h1 className="text-5xl font-extrabold text-white mb-8">Weather App</h1>
      <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
        <Select
          options={options}
          value={selectedCity}
          onChange={setSelectedCity}
          onInputChange={fetchCitySuggestions}
          placeholder="Select a city"
          className="w-full"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#ddd',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#aaa',
              },
            }),
            menu: (base) => ({
              ...base,
              borderRadius: '0.5rem',
              padding: '0.5rem',
            }),
            option: (base) => ({
              ...base,
              padding: '1rem',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }),
          }}
        />
        <button
          onClick={fetchWeather}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Get Weather
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-200 text-red-800 rounded-lg shadow-md w-full max-w-md">
          {error}
        </div>
      )}

      {weather && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold text-blue-800">Weather in {weather.name}</h2>
          <p className="text-gray-700 mt-2">{weather.weather[0].description}</p>
          <p className="text-gray-800 mt-2 text-lg">Temperature: {weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}
