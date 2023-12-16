export class OpenMeteo {
    baseUrl = 'https://api.open-meteo.com/v1'
    async current(lat: number | string, lon: number | string) {
        const res = await fetch(`${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&wind_speed_unit=ms&current=temperature_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m,relative_humidity_2m`)
        const data = await res.json()
        const {
            temperature_2m, apparent_temperature, surface_pressure,
            wind_speed_10m, wind_direction_10m, relative_humidity_2m
        } = data.current
        return {
            temperature: {
                current: temperature_2m as number,
                apparent: apparent_temperature as number
            },
            pressure: {
                hPa: surface_pressure as number,
                mmHg: hectopascalToMercury(surface_pressure)
            },
            wind: {
                speed: wind_speed_10m as number,
                angle: wind_direction_10m as number,
                direction: convertAngleToDirection(wind_direction_10m)
            },
            humidity: relative_humidity_2m as number
        }
    }
}

function hectopascalToMercury(hPa: number) {
    const mmHg = hPa * 0.75006375541921
    return Math.round(mmHg)
}

function convertAngleToDirection(angle: number) {
    const directions: [number, number, string][] = [
        [0, 22.5, "Север"],
        [22.5, 67.5, "Северо-Восток"],
        [67.5, 112.5, "Восток"],
        [112.5, 157.5, "Юго-Восток"],
        [157.5, 202.5, "Юг"],
        [202.5, 247.5, "Юго-Запад"],
        [247.5, 292.5, "Запад"],
        [292.5, 337.5, "Северо-Запад"],
        [337.5, 360, "Север"]
    ]
    for (const [min, max, direction] of directions) {
        if (angle >= min && angle < max) return direction
    }
    return "Неизвестно"
}
