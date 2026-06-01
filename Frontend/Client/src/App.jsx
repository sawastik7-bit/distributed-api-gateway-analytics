import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import StatsCard  from './components/StatsCard';
import LiveChart  from './components/LiveChart';
import TopRoutes  from './components/TopRoutes';
import RecentLogs from './components/RecentLogs';

const socket = io('http://localhost:4003');

const App = () => {

  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({
    totalRequests:     0,
    requestsPerMinute: 0,
    averageResponse:   0,
    errorRate:         0,
    topRoutes:         [],
    recentLogs:        []
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('stats', (newStats) => {
      setStats(newStats);

      setChartData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          requests: newStats.requestsPerMinute
        };
        const updated = [...prev, newPoint];
        if (updated.length > 20) updated.shift();
        return updated;
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('stats');
    };
  }, []);

  if (!connected) {
    return (
      <div className="connecting">
        <div className="connecting-dot" />
        Connecting to worker...
      </div>
    );
  }

  return (
    <div className="dashboard">

      
      <div className="header">
        <h1 className="header-title">
          API Gateway Analytics
        </h1>
      </div>

      
      <div className="stats-grid">
        <StatsCard
          label="Total Requests"
          value={stats.totalRequests}
        />
        <StatsCard
          label="Requests / Min"
          value={stats.requestsPerMinute}
        />
        <StatsCard
          label="Avg Response"
          value={stats.averageResponse}
          unit="ms"
        />
        <StatsCard
          label="Error Rate"
          value={stats.errorRate}
          unit="%"
        />
      </div>

      
      <LiveChart data={chartData} />

      <div className="bottom-grid">
        <TopRoutes routes={stats.topRoutes} />
        <RecentLogs logs={stats.recentLogs} />
      </div>

    </div>
  );
};

export default App;