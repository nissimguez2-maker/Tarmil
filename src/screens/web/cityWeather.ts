export type WeatherCondition = 'sun' | 'partly-cloudy' | 'cloud' | 'rain';

export type WeatherDay = {
  isoDate: string;
  tempHighC: number;
  tempLowC: number;
  condition: WeatherCondition;
  precipPercent: number;
};

export const CITY_WEATHER: Record<string, WeatherDay[]> = {
  buzios: [
    { isoDate: '2026-10-26', tempHighC: 25, tempLowC: 19, condition: 'partly-cloudy', precipPercent: 20 },
    { isoDate: '2026-10-27', tempHighC: 26, tempLowC: 20, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-10-28', tempHighC: 28, tempLowC: 21, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-10-29', tempHighC: 28, tempLowC: 21, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-10-30', tempHighC: 25, tempLowC: 20, condition: 'partly-cloudy', precipPercent: 30 },
    { isoDate: '2026-10-31', tempHighC: 23, tempLowC: 19, condition: 'rain', precipPercent: 70 },
    { isoDate: '2026-11-01', tempHighC: 24, tempLowC: 18, condition: 'partly-cloudy', precipPercent: 40 },
  ],
  'sao-paulo': [
    { isoDate: '2026-10-30', tempHighC: 26, tempLowC: 16, condition: 'partly-cloudy', precipPercent: 30 },
    { isoDate: '2026-10-31', tempHighC: 24, tempLowC: 15, condition: 'rain', precipPercent: 70 },
    { isoDate: '2026-11-01', tempHighC: 25, tempLowC: 16, condition: 'partly-cloudy', precipPercent: 40 },
    { isoDate: '2026-11-02', tempHighC: 27, tempLowC: 17, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-11-03', tempHighC: 28, tempLowC: 18, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-04', tempHighC: 27, tempLowC: 18, condition: 'partly-cloudy', precipPercent: 20 },
    { isoDate: '2026-11-05', tempHighC: 26, tempLowC: 18, condition: 'rain', precipPercent: 60 },
    { isoDate: '2026-11-06', tempHighC: 25, tempLowC: 17, condition: 'cloud', precipPercent: 40 },
    { isoDate: '2026-11-07', tempHighC: 27, tempLowC: 17, condition: 'sun', precipPercent: 10 },
  ],
  jericoacoara: [
    { isoDate: '2026-11-05', tempHighC: 31, tempLowC: 24, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-06', tempHighC: 31, tempLowC: 24, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-07', tempHighC: 32, tempLowC: 25, condition: 'sun', precipPercent: 0 },
    { isoDate: '2026-11-08', tempHighC: 32, tempLowC: 25, condition: 'sun', precipPercent: 0 },
    { isoDate: '2026-11-09', tempHighC: 33, tempLowC: 25, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-10', tempHighC: 33, tempLowC: 26, condition: 'partly-cloudy', precipPercent: 15 },
    { isoDate: '2026-11-11', tempHighC: 32, tempLowC: 25, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-11-12', tempHighC: 31, tempLowC: 24, condition: 'partly-cloudy', precipPercent: 20 },
    { isoDate: '2026-11-13', tempHighC: 32, tempLowC: 25, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-14', tempHighC: 32, tempLowC: 25, condition: 'sun', precipPercent: 5 },
  ],
  'buenos-aires': [
    { isoDate: '2026-11-12', tempHighC: 22, tempLowC: 14, condition: 'rain', precipPercent: 70 },
    { isoDate: '2026-11-13', tempHighC: 23, tempLowC: 15, condition: 'partly-cloudy', precipPercent: 40 },
    { isoDate: '2026-11-14', tempHighC: 24, tempLowC: 15, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-11-15', tempHighC: 26, tempLowC: 16, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-16', tempHighC: 27, tempLowC: 17, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-11-17', tempHighC: 26, tempLowC: 17, condition: 'partly-cloudy', precipPercent: 30 },
    { isoDate: '2026-11-18', tempHighC: 24, tempLowC: 16, condition: 'cloud', precipPercent: 50 },
    { isoDate: '2026-11-19', tempHighC: 25, tempLowC: 16, condition: 'sun', precipPercent: 15 },
    { isoDate: '2026-11-20', tempHighC: 26, tempLowC: 17, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-11-21', tempHighC: 27, tempLowC: 17, condition: 'partly-cloudy', precipPercent: 20 },
  ],
  'punta-del-este': [
    { isoDate: '2026-11-18', tempHighC: 22, tempLowC: 15, condition: 'partly-cloudy', precipPercent: 40 },
    { isoDate: '2026-11-19', tempHighC: 23, tempLowC: 16, condition: 'sun', precipPercent: 10 },
    { isoDate: '2026-11-20', tempHighC: 24, tempLowC: 17, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-21', tempHighC: 25, tempLowC: 18, condition: 'sun', precipPercent: 5 },
    { isoDate: '2026-11-22', tempHighC: 25, tempLowC: 18, condition: 'partly-cloudy', precipPercent: 20 },
    { isoDate: '2026-11-23', tempHighC: 23, tempLowC: 17, condition: 'rain', precipPercent: 65 },
    { isoDate: '2026-11-24', tempHighC: 22, tempLowC: 16, condition: 'cloud', precipPercent: 50 },
    { isoDate: '2026-11-25', tempHighC: 24, tempLowC: 17, condition: 'sun', precipPercent: 15 },
  ],
};

export function cityWeather(stopId: string): WeatherDay[] {
  return CITY_WEATHER[stopId] ?? [];
}
