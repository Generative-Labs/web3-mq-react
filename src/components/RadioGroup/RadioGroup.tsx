import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import ss from './index.scss';

export type IValueType = {
  id: string;
  name: string;
};

type IProps = {
  className?: string;
  style?: React.CSSProperties;
  value: IValueType[];
  onChange: (data: IValueType) => void;
};

const UnMemoizedRadioGroup: React.FC<IProps> = (props) => {
  const { value = [], onChange, className, style } = props;
  const [selected, setSelected] = useState<string>('1');

  const handleSelect = useCallback(
    (item) => {
      const { id } = item;
      setSelected(id);
      onChange && onChange(item);
    },
    [onChange],
  );

  const Radio = useCallback(
    (item: IValueType) => (
      <div className={ss.radio} key={item.id} onClick={() => handleSelect(item)}>
        <div className={cx(ss.label, { [ss.selected]: selected === item.id })}>
          {selected === item.id && <div className={ss.inner} />}
        </div>
        <div>{item.name}</div>
      </div>
    ),
    [selected],
  );

  return (
    <div style={style} className={cx(className, ss.radioGroupContainer)}>
      {value.map(Radio)}
    </div>
  );
};

export const RadioGroup = React.memo(UnMemoizedRadioGroup);
