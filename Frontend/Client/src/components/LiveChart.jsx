import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const LiveChart = ({ data }) => {
  return (
    <div className="chart-section">

      <div className="section-title">
        Live Requests Per Minute
      </div>

      {data.length === 0 ? (
        <div className="empty">
          Waiting for requests...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>

          <CartesianGrid
  strokeDasharray="3 3"
  stroke="#f1f5f9"
  vertical={false}
/>

            <XAxis
              dataKey="time"
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: 13
              }}
              labelStyle={{ color: '#64748b' }}
            />

            <Line
  type="monotone"
  dataKey="requests"
  stroke="#6366f1"
  strokeWidth={2.5}
  dot={false}
  isAnimationActive={false}
/>

          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  );
};

export default LiveChart;