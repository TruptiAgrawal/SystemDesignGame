import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './LandingPage.module.css';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Background grid */}
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.scanline} />
      </div>

      {/* Terminal window */}
      <motion.div
        className={styles.terminal}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Title bar */}
        <div className={styles.titleBar}>
          <div className={styles.dots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <span className={styles.titleLabel}>system-design-v1.0.sh</span>
          <div className={styles.titleSpacer} />
        </div>

        {/* Terminal body */}
        <div className={styles.body}>

          {/* Prompt line */}
          <motion.div className={styles.prompt} {...fadeUp(0.2)}>
            <span className={styles.promptUser}>root@prod</span>
            <span className={styles.promptSep}>:</span>
            <span className={styles.promptPath}>~</span>
            <span className={styles.promptDollar}>$</span>
            <span className={styles.promptCmd}> ./run-simulation.sh</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className={styles.headline} {...fadeUp(0.45)}>
            Scale<span className={styles.headlineSep}> or </span>Fail.
          </motion.h1>

          {/* Subline */}
          <motion.p className={styles.subline} {...fadeUp(0.6)}>
            Build architectures that survive 10M+ users.
            <br />
            <span className={styles.sublineAccent}>Real traffic. Real bottlenecks. Real chaos.</span>
          </motion.p>

          {/* Divider */}
          <motion.div className={styles.divider} {...fadeUp(0.7)} />

          {/* Steps */}
          <motion.div className={styles.steps} {...fadeUp(0.8)}>
            {[
              { n: '01', label: 'ARCHITECT', desc: 'Drag nodes. Draw traffic edges. Tune specs.' },
              { n: '02', label: 'SIMULATE',  desc: 'Deploy to "Production." Watch it ramp.' },
              { n: '03', label: 'POST-MORTEM', desc: 'Analyze failures. Scale up. Ace it.' },
            ].map(({ n, label, desc }) => (
              <div className={styles.step} key={n}>
                <span className={styles.stepNumber}>{n}.</span>
                <h4 className={styles.stepLabel}>{label}</h4>
                <p className={styles.stepDesc}>{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp(1.0)}>
            <motion.button
              className={styles.cta}
              onClick={() => navigate('/gallery')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.ctaPrompt}>&gt;&nbsp;</span>
              Start First Mission
              <span className={styles.cursor}>_</span>
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;