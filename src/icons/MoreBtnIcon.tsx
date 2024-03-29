import React from 'react';

export const MoreBtnIcon = (props: any) => {
  return (
    <div {...props}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="30" height="30" rx="15" fill="#605DEC" />
        <rect x="1" y="1" width="28" height="28" rx="14" stroke="#605DEC" stroke-width="2" />
        <path
          d="M14.8834 6.00673L15 6C15.5128 6 15.9355 6.38604 15.9933 6.88338L16 7V14H23C23.5128 14 23.9355 14.386 23.9933 14.8834L24 15C24 15.5128 23.614 15.9355 23.1166 15.9933L23 16H16V23C16 23.5128 15.614 23.9355 15.1166 23.9933L15 24C14.4872 24 14.0645 23.614 14.0067 23.1166L14 23V16H7C6.48716 16 6.06449 15.614 6.00673 15.1166L6 15C6 14.4872 6.38604 14.0645 6.88338 14.0067L7 14H14V7C14 6.48716 14.386 6.06449 14.8834 6.00673L15 6L14.8834 6.00673Z"
          fill="white"
        />
      </svg>
    </div>
  );
};
