import React, { useRef, useState } from 'react';
import cx from 'classnames';

import { Avatar } from '../Avatar';
import { Empty } from './Empty';
import { Button } from '../Button';
import { SearchInput } from './SearchInput';

import { getShortAddress } from '../../utils';

import ss from './CreateChannel.scss';

type SelectContactsProps = {
  className?: string;
  contactList: Array<any>;
  selectedContacts: Array<any>;
  handleNext: () => void;
  onSelected: (contact: Array<any>) => void;
  onDeleted: (contact: Array<any>) => void;
};

export const SelectContacts: React.FC<SelectContactsProps> = React.memo((props) => {
  const { className, contactList, selectedContacts, handleNext, onDeleted, onSelected } = props;
  const [ content, setContent ] = useState<string>('');
  const [ searchResult, setSearchResult] = useState<any[]>(contactList);
  const [ inputWidth, setInputWidth ] = useState<number>(4);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isChecked = (userid: string) => {
    if (selectedContacts.find(item => item.userid === userid)) {
      return true;
    }
    return false;
  };
  // search contact
  const startFind = async (value: string) => {
    setSearchResult(contactList.filter(item => item.nickname.indexOf(value) >= 0));
  };
  // selector foucs or blur
  const handleFocusOrBlur = (e: React.BaseSyntheticEvent) => {
    if (!inputRef.current || !selectorRef.current) return;
    if (selectorRef.current.contains(e.target)) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  };

  const handleChange = (value: string, type: 'search' | 'select') => {
    const length = value.length;
    if (type === 'select' && length) {
      // 数字 大小写字母 符号 中文 统一加14
      setInputWidth(inputWidth + 14 * length);
    };
    setContent(value);
    startFind(value);
  };
  const selectedOrDeletedContact = (contact: any) => {
    if (selectedContacts.find((item) => item.userid === contact.userid)) {
      onDeleted(contact);
      return;
    };
    setContent('');
    setInputWidth(4);
    setSearchResult(contactList);
    onSelected(contact);
  };

  return (
    <div className={cx(ss.selectContactsContainer, className)}>
      { !selectedContacts.length ? (
        <SearchInput style={{margin: '0px 16px'}} value={content} onChange={(e) => handleChange(e, 'search')} />
      ) : (
        <div className={ss.inputContainer} ref={selectorRef} onClick={handleFocusOrBlur}>
          <div className={ss.contactSelector}>
            {selectedContacts.map((contact) => (
              <div key={contact.userid} className={ss.selectedBox}>
                {contact.nickname || getShortAddress(contact.userid)}
              </div>
            ))}
            <div style={{maxWidth: '100%', display: 'inline-flex', width: `${inputWidth}px`}}>
              <input className={ss.inputElement} ref={inputRef} type='text' value={content} onChange={(e) => handleChange(e.target.value, 'select')} />
            </div>
          </div>
        </div>
      )}
      { !contactList.length ? 
        <Empty content='No friends' />
        : !searchResult.length ? 
          <Empty content='No result' /> 
          : 
          <div className={ss.mainContainer}>
            { searchResult.map(item => {
              return (
                <label key={item.userid} className={ss.searchContactItem}>
                  <input 
                    className={ss.checkBox} 
                    checked={isChecked(item.userid)}
                    type='checkbox'  
                    onChange={() => selectedOrDeletedContact(item)}
                  />
                  <Avatar image={item.avatar_url} size={40} />
                  <div className={ss.wrapper}>
                    {item.nickname ||  getShortAddress(item.userid)}
                  </div>
                </label>
              );
            })}
          </div>
      }
      <div className={cx(ss.btnContaner)}>
        <Button block disabled={selectedContacts.length < 1} size='large' type='primary' onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
});