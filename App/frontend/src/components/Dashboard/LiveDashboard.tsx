import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useSystemStore } from '../../store/useSystemStore';
import styles from './LiveDashboard.module.css';

interface HistoryPoint {
  time: string;
  rps: number;
  latency: number;
  errorRate: number;
}

const LiveDashboard = () => {
  const { liveMetrics, isSimulating } = useSystemStore();
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    if (!isSimulating) {
      setHistory([]);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      
      setHistory(prev => {
        const newHistory = [...prev, {
          time: timeStr,
          rps: liveMetrics.rps,
          latency: liveMetrics.latency,
          errorRate: liveMetrics.errorRate,
        }];
        // Keep last 20 points
        return newHistory.slice(-20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, liveMetrics]);

  if (!isSimulating) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <label>Traffic (RPS)</label>
          <div className={styles.value}>{liveMetrics.rps.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <label>Latency (avg)</label>
          <div className={styles.value}>{liveMetrics.latency}ms</div>
        </div>
        <div className={styles.statCard}>
          <label>Errors</label>
          <div className={`${styles.value} ${liveMetrics.errorRate > 0 ? styles.error : ''}`}>
            {liveMetrics.errorRate}%
          </div>
        </div>
        <div className={styles.statCard}>
          <label>Cost/hr</label>
          <div className={styles.value}>${Math.round(liveMetrics.cost)}</div>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartWrapper}>
          <h4>Latency vs RPS</h4>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" hide />
              <YAxis stroke="#888" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                itemStyle={{ fontSize: '10px' }}
              />
              <Area type="monotone" dataKey="latency" stroke="#00ff41" fill="#00ff41" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;
