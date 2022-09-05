import { useCallback, useMemo } from 'react';
import { useInput } from '../../hooks/useInput';

import ss from './index.module.scss';

interface IStep {
  step: number;
  content: React.ReactNode;
}

const SudoSwap = () => {
  const { input } = useInput('');
  const { value } = input;

  const stepsMap: IStep[] = useMemo(
    () => [
      {
        step: 1,
        content: (
          <div className={ss.step1}>
            Go to
            <span
              onClick={() => {
                window.open('https://sudoswap.xyz/', '_blank');
              }}>
              Sudoswap
            </span>
          </div>
        ),
      },
      {
        step: 2,
        content: (
          <div className={ss.step2}>
            Look for
            <span>“recent swaps”</span>, click a swap you would like to share to
            chat.
          </div>
        ),
      },
      {
        step: 3,
        content: (
          <div>
            Once the swap opened, look for “trade code” copy and paste it on
            step 4.
          </div>
        ),
      },
      {
        step: 4,
        content: (
          <input
            {...input}
            placeholder='Enter trade code'
            className={ss.stepInput}
          />
        ),
      },
    ],
    [input]
  );

  const handleSubmit = useCallback(() => {
    console.log('submit', value);
  }, [value]);

  const Steps = useCallback((item: IStep) => {
    const { step, content } = item;
    return (
      <div key={step} className={ss.stepContainer}>
        <div className={ss.circle}>{step}</div>
        <div className={ss.right}>
          <div className={ss.step}>{`Step ${step}`}</div>
          <div className={ss.content}>{content}</div>
        </div>
      </div>
    );
  }, []);

  return (
    <div className={ss.container}>
      <div className={ss.title}>How to share a Sudoswap to chat</div>
      <div>{stepsMap.map(Steps)}</div>
      <div className={ss.submitBtn} onClick={handleSubmit}>
        Send to chat
      </div>
    </div>
  );
};

export default SudoSwap;
