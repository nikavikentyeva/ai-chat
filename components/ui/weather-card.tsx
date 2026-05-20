import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake, CloudSun } from 'lucide-react';

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: string;
}

export const WeatherCard = React.memo(WeatherCardComponent);

const iconMap: Record<string, React.ReactNode> = {
  Солнечно: <Sun className="h-8 w-8 text-yellow-500" />,
  Облачно: <Cloud className="h-8 w-8 text-gray-400" />,
  Дождь: <CloudRain className="h-8 w-8 text-blue-400" />,
  Снег: <Snowflake className="h-8 w-8 text-blue-300" />,
};

function WeatherCardComponent({ city, temperature, condition }: WeatherCardProps) {
  return (
    <div className="my-2 flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {iconMap[condition] || <CloudSun className="h-8 w-8 text-yellow-400" />}
      <div>
        <p className="text-sm text-muted-foreground">{city}</p>
        <p className="text-2xl font-bold">{temperature}°C</p>
        <p className="text-sm">{condition}</p>
      </div>
    </div>
  );
}
