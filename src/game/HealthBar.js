import React from 'react';

const HealthBar = ({ maxHp = 100, hp = 100 } = {}) => {
    const barWidth = (hp / maxHp) * 100;
    // setHitWidth((damage / hp) * 100);
    // setBarWidth((hpLeft / maxHp) * 100);
    return (
        <div>
            <div class="health-bar">
                <div class="hover-info">{hp * 10}/{maxHp * 10}</div>
                <div class="bar" style={{ width: `${barWidth}%` }}></div>
                <div class="hit" style={{ width: `${0}%` }}></div>
            </div>
            <br />
        </div>
    );
};

export default HealthBar;