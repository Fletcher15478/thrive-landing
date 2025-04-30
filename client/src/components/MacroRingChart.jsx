import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import '../MacroTracker.css';

function MacroRingChart({ totals }) {
  const goals = {
    calories: 2000,
    protein: 150,
    fat: 70,
    carbs: 250,
  };

  const [active, setActive] = useState(null);

  const chartData = [
    {
      name: 'Fat',
      value: Math.min((totals.fat / goals.fat) * 100, 100),
      actual: `${totals.fat.toFixed(1)} g`,
      fill: '#FACC15',
    },
    {
      name: 'Carbs',
      value: Math.min((totals.carbs / goals.carbs) * 100, 100),
      actual: `${totals.carbs.toFixed(1)} g`,
      fill: '#38BDF8',
    },
    {
      name: 'Protein',
      value: Math.min((totals.protein / goals.protein) * 100, 100),
      actual: `${totals.protein.toFixed(1)} g`,
      fill: '#4ADE80',
    },
    {
      name: 'Calories',
      value: Math.min((totals.calories / goals.calories) * 100, 100),
      actual: `${totals.calories.toFixed(0)} kcal`,
      fill: '#FF6B6B',
    },
  ];
  

  return (
    <div
      style={{
        background: '#2c4766',
        padding: '2rem',
        borderRadius: '1rem',
        marginTop: '2rem',
        width: '100%',
        height: '420px'
      }}
    >
      <h3 style={{ textAlign: 'center', color: '#0ef', marginBottom: '1rem' }}>
        Daily Macro Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          innerRadius="10%"
          outerRadius="90%"
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background
            dataKey="value"
            clockWise
            label={({ index }) =>
              active?.name === chartData[index].name ? chartData[index].actual : ''
            }
          />
          <Tooltip
            formatter={(val, name, props) => props.payload.actual}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span style={{ color: chartData.find(d => d.name === value).fill }}>
                {value}
              </span>
            )}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MacroRingChart;
