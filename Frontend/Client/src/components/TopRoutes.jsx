const TopRoutes = ({ routes }) => {

  const maxCount = routes.length > 0
    ? Math.max(...routes.map(r => r.count))
    : 1;

  return (
    <div className="bottom-card">

      <div className="section-title">
        Top Routes
      </div>

      {routes.length === 0 ? (
        <div className="empty">
          No data yet...
        </div>
      ) : (
        routes.map((item, index) => (
          <div className="route-item" key={index}>

            <div className="route-info">
              <span>{item.route}</span>
              <span className="route-count">
                {item.count}
              </span>
            </div>

            <div className="route-bar-bg">
              <div
                className="route-bar-fill"
                style={{
                  width: `${(item.count / maxCount) * 100}%`
                }}
              />
            </div>

          </div>
        ))
      )}

    </div>
  );
};

export default TopRoutes;