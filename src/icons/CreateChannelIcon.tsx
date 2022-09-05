import React from 'react';

export const CreateChannelIcon = (props: any) => (
  <div {...props}>
    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_4442_10264)">
        <rect x="15" y="15" width="40" height="40" rx="20" fill="#615EF0" />
        <path
          d="M43.125 35.5C43.125 36.2031 42.5391 36.7891 41.875 36.7891H36.25V42.4141C36.25 43.0781 35.6641 43.625 35 43.625C34.2969 43.625 33.75 43.0781 33.75 42.4141V36.7891H28.125C27.4219 36.7891 26.875 36.2031 26.875 35.5C26.875 34.8359 27.4219 34.2891 28.125 34.2891H33.75V28.6641C33.75 27.9609 34.2969 27.375 35 27.375C35.6641 27.375 36.25 27.9609 36.25 28.6641V34.2891H41.875C42.5391 34.25 43.125 34.8359 43.125 35.5Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4442_10264"
          x="0"
          y="0"
          width="70"
          height="70"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.254355 0 0 0 0 0.244132 0 0 0 0 0.741667 0 0 0 0.24 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4442_10264" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4442_10264"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
);
