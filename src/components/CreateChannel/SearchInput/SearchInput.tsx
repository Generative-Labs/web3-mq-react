import React, { useState } from 'react';
import cx from 'classnames';

import {  SearchIcon, CleanCircleIcon } from '../../../icons';

import ss from './index.scss';

export type SearchInputProps = {
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
}

const UnMemoSearchInput = (props: SearchInputProps) => {
  const { style, value = '', onChange } = props;
  const [ inputValue, setInputValue ] = useState(value);
  const [ isSearchInputFoucs, setIsSearchInputFoucs ] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e.target.value);
  };
  const handleClean = () => {
    setInputValue('');
    onChange && onChange('');
  };

  return (
    <span 
      className={cx(ss.searchInput, {
        [ss.searchInputFoucs]: isSearchInputFoucs
      })}
      style={style}
    >
      <SearchIcon className={ss.searchIcon} />
      <input 
        type="text" 
        placeholder='Search' 
        value={inputValue} 
        onChange={handleChange} 
        onFocus={() => { setIsSearchInputFoucs(true) }}
        onBlur={() => { setIsSearchInputFoucs(false) }}
      />
      <CleanCircleIcon 
        className={cx(ss.cleanBtn, {
          [ss.hide]: !inputValue
        })} 
        onClick={handleClean}
      />
    </span>
  );
};

export const SearchInput = React.memo(UnMemoSearchInput);