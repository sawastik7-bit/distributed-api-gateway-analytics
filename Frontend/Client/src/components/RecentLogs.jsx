const RecentLogs = ({ logs }) => {

  const getStatusClass = (status) => {
    if (status >= 500) return 'status-5xx';
    if (status === 429) return 'status-429';
    if (status >= 400) return 'status-4xx';
    return 'status-2xx';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bottom-card">

      <div className="section-title">
        Recent Requests
      </div>

      {logs.length === 0 ? (
        <div className="empty">
          No logs yet...
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Route</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="method">
                  {log.method}
                </td>
                <td>{log.route}</td>
                <td className={getStatusClass(log.status)}>
                  {log.status}
                </td>
                <td className="duration">
                  {log.duration}ms
                </td>
                <td className="time">
                  {formatTime(log.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default RecentLogs;