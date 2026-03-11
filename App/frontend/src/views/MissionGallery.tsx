import { useNavigate } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { useSystemStore } from '../store/useSystemStore';
import styles from './MissionGallery.module.css';

const MissionGallery = () => {
  const navigate = useNavigate();
  const { acedMissions, setActiveMission } = useSystemStore();

  const handleSelectMission = (missionId: string) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (mission) {
      setActiveMission(mission);
      navigate('/architect');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Select Your Mission</h1>
        <p>Choose a challenge to test your architectural skills.</p>
      </header>

      <div className={styles.grid}>
        {MISSIONS.map((mission) => (
          <div 
            key={mission.id} 
            className={`${styles.card} ${acedMissions.includes(mission.id) ? styles.aced : ''}`}
            onClick={() => handleSelectMission(mission.id)}
          >
            {acedMissions.includes(mission.id) && <div className={styles.acedBadge}>ACED</div>}
            <div className={styles.difficulty}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < mission.difficulty ? styles.starActive : styles.star}>★</span>
              ))}
            </div>
            <h2 className={styles.title}>{mission.title}</h2>
            <div className={styles.profile}>{mission.trafficProfile}</div>
            
            <div className={styles.targets}>
              <div className={styles.targetItem}>
                <label>Target RPS</label>
                <span>{mission.targets.rps.toLocaleString()}</span>
              </div>
              <div className={styles.targetItem}>
                <label>Max Latency</label>
                <span>{mission.targets.latency}ms</span>
              </div>
              <div className={styles.targetItem}>
                <label>Budget</label>
                <span>${mission.targets.budget}</span>
              </div>
            </div>

            <button className={styles.startBtn}>Start Mission</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionGallery;
