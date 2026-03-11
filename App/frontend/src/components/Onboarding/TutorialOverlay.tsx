import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TutorialOverlay.module.css';

const STEPS = [
  {
    title: "1. DRAG COMPONENTS",
    description: "Start by dragging a USER node and an API SERVER from the left palette onto the canvas.",
    target: "palette"
  },
  {
    title: "2. CONNECT TRAFFIC",
    description: "Draw a line from the USER's bottom handle to the SERVER's top handle to route traffic.",
    target: "canvas"
  },
  {
    title: "3. DEPLOY & SCALE",
    description: "Click DEPLOY to start the traffic ramp. If nodes turn red, select them and increase instances!",
    target: "deploy"
  }
];

const TutorialOverlay = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <AnimatePresence>
      <div className={styles.overlay}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={styles.modal}
        >
          <div className={styles.progress}>
            {STEPS.map((_, i) => (
              <div key={i} className={`${styles.dot} ${i <= currentStep ? styles.active : ''}`} />
            ))}
          </div>

          <h3>{STEPS[currentStep].title}</h3>
          <p>{STEPS[currentStep].description}</p>

          <div className={styles.actions}>
            {currentStep < STEPS.length - 1 ? (
              <button onClick={() => setCurrentStep(prev => prev + 1)}>Next Step _</button>
            ) : (
              <button onClick={onClose}>Got it, Architect!</button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
