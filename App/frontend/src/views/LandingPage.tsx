import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.content}
        >
          <div className={styles.header}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.title}>system-design-v1.0.sh</span>
          </div>
          
          <div className={styles.body}>
            <h1 className={styles.headline}>Scale or Fail.</h1>
            <p className={styles.subline}>
              Build architectures that survive 10M+ users. 
              Real traffic. Real bottlenecks. Real chaos.
            </p>
            
            <div className={styles.tutorialGrid}>
              <div className={styles.step}>
                <span className={styles.number}>01.</span>
                <h4>ARCHITECT</h4>
                <p>Drag nodes. Draw traffic edges. Tune specs.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.number}>02.</span>
                <h4>SIMULATE</h4>
                <p>Deploy to "Production." Watch it ramp.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.number}>03.</span>
                <h4>POST-MORTEM</h4>
                <p>Analyze failures. Scale up. Ace it.</p>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.cta}
              onClick={() => navigate('/gallery')}
            >
              Start First Mission _
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className={styles.background}>
        <div className={styles.grid}></div>
      </div>
    </div>
  );
};

export default LandingPage;
