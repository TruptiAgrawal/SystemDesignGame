import { useMemo } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import styles from './PostMortem.module.css';

const PostMortem = ({ onRetry }: { onRetry: () => void }) => {
  const { activeMission, liveMetrics, aceMission } = useSystemStore();

  const results = useMemo(() => {
    if (!activeMission) return null;

    const isReliable = liveMetrics.errorRate <= activeMission.targets.errorRate;
    const isFast = liveMetrics.latency <= activeMission.targets.latency;
    const isOnBudget = liveMetrics.cost <= activeMission.targets.budget;
    const metRPS = liveMetrics.rps >= activeMission.targets.rps;

    const success = isReliable && isFast && isOnBudget && metRPS;
    
    if (success) {
      aceMission(activeMission.id);
    }

    return {
      success,
      isReliable,
      isFast,
      isOnBudget,
      metRPS,
    };
  }, [activeMission, liveMetrics, aceMission]);

  if (!results || !activeMission) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={results.success ? styles.success : styles.fail}>
          {results.success ? 'MISSION ACED' : 'SYSTEM FAILURE'}
        </h2>
        
        <div className={styles.stats}>
          <div className={styles.statLine}>
            <span>Reliability (Errors &lt; {activeMission.targets.errorRate}%)</span>
            <span className={results.isReliable ? styles.ok : styles.bad}>
              {results.isReliable ? 'PASS' : 'FAIL'} ({liveMetrics.errorRate}%)
            </span>
          </div>
          <div className={styles.statLine}>
            <span>Performance (Latency &lt; {activeMission.targets.latency}ms)</span>
            <span className={results.isFast ? styles.ok : styles.bad}>
              {results.isFast ? 'PASS' : 'FAIL'} ({liveMetrics.latency}ms)
            </span>
          </div>
          <div className={styles.statLine}>
            <span>Throughput (RPS &gt; {activeMission.targets.rps})</span>
            <span className={results.metRPS ? styles.ok : styles.bad}>
              {results.metRPS ? 'PASS' : 'FAIL'} ({liveMetrics.rps})
            </span>
          </div>
          <div className={styles.statLine}>
            <span>Budget (Cost &lt; ${activeMission.targets.budget})</span>
            <span className={results.isOnBudget ? styles.ok : styles.bad}>
              {results.isOnBudget ? 'PASS' : 'FAIL'} (${Math.round(liveMetrics.cost)})
            </span>
          </div>
        </div>

        <div className={styles.insights}>
          <h4>Architect's Notes:</h4>
          {!results.isReliable && <p>• Your system is dropping requests. Consider adding more server instances or a cache to offload the DB.</p>}
          {!results.isFast && <p>• Latency is too high. A CDN or closer-to-edge servers might help.</p>}
          {!results.isOnBudget && <p>• You over-engineered! Try downgrading CPU/RAM on less critical nodes.</p>}
          {results.success && <p>• Flawless execution. Your system scaled beautifully under pressure.</p>}
        </div>

        <div className={styles.actions}>
          <button onClick={onRetry} className={styles.retryBtn}>Retry Design</button>
          <button onClick={() => window.location.href='/gallery'} className={styles.nextBtn}>Back to Gallery</button>
        </div>
      </div>
    </div>
  );
};

export default PostMortem;
