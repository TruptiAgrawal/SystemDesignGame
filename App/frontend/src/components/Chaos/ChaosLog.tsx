import { useRef, useEffect } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import styles from './ChaosLog.module.css';

const ChaosLog = () => {
  const { logs, isSimulating } = useSystemStore();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0; // Newest on top as we [message, ...state.logs]
    }
  }, [logs]);

  if (!isSimulating) return null;

  return (
    <div className={styles.chaosLog}>
      <div className={styles.header}>Chaos Log (Live)</div>
      <div className={styles.logList} ref={logRef}>
        {logs.length === 0 && <div className={styles.empty}>Monitoring traffic...</div>}
        {logs.map((log, idx) => (
          <div key={idx} className={styles.logItem}>
            <span className={styles.timestamp}>[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChaosLog;
