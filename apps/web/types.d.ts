declare module 'react-water-wave' {
    import * as React from 'react';
    export interface WaterWaveProps {
        imageUrl?: string;
        dropRadius?: number;
        perturbance?: number;
        resolution?: number;
        interactive?: boolean;
        style?: React.CSSProperties;
        children?: (methods: any) => React.ReactNode;
        [key: string]: any;
    }
    const WaterWave: React.FC<WaterWaveProps>;
    export default WaterWave;
}
