import React from 'react'

const statsCard = ({label,value,unit}) => {
  return (
    <div>
      <div className='stat-card'>
        <div className='stat-label'>{label}</div>
<div className='stat-value'>{value}
    {unit && <span className="stat-unit">{unit}</span>}
</div>

      </div>
    </div>
  )
}

export default statsCard;
