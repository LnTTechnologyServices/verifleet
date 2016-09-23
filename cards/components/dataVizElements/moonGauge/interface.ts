interface MoonGauge {
    decimals?: number, // number of decimals to display on value
    max?: number, // default to 100
    min?: number, // default to 0
    value: number,
    unit?: string, // %, °C, °F, RPM
    title?: string, // Open
    stops:  (number | string)[][], // highcharts style stops - an array of [% of gauge, color]
    startAngle: number, // start position (default: -90)
    endAngle: number // end position (default: 90)
}
