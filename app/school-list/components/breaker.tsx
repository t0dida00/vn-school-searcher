import React from 'react';

interface BreakerProps {
    className?: string;
    style?: React.CSSProperties;
}

const Breaker: React.FC<BreakerProps> = ({ className = '', style }) => (
    <hr className={className} style={style} />
);

export default Breaker;