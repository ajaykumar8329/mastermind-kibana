/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';

export const Wrench = ({ ...props }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="#666977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.72203 7.72203C7.27334 8.17072 6.75384 8.50545 6.1995 8.72621L10.0453 12.572C10.743 13.2697 11.8743 13.2697 12.572 12.572C13.2697 11.8743 13.2697 10.743 12.572 10.0453L10.0841 7.5574C9.90745 7.38074 9.90745 7.09433 10.0841 6.91768C10.2608 6.74103 10.5472 6.74103 10.7238 6.91768L13.2117 9.40559C14.2628 10.4566 14.2628 12.1607 13.2117 13.2117C12.1607 14.2628 10.4566 14.2628 9.40558 13.2117L5.19148 8.99762C3.82268 9.20088 2.37855 8.77569 1.32489 7.72203C-0.0859076 6.31123 -0.369999 4.20039 0.472618 2.50765C0.600059 2.25164 0.938249 2.21768 1.14047 2.4199L3.24403 4.52346C3.59734 4.87677 4.17016 4.87677 4.52346 4.52346C4.87677 4.17016 4.87677 3.59734 4.52346 3.24403L2.4199 1.14047C2.21768 0.938248 2.25164 0.600059 2.50765 0.472618C4.20039 -0.369999 6.31123 -0.0859078 7.72203 1.32489C9.48855 3.09141 9.48855 5.95551 7.72203 7.72203ZM1.96461 7.08232C3.37782 8.49554 5.6691 8.49554 7.08232 7.08232C8.49553 5.6691 8.49553 3.37782 7.08232 1.96461C6.25493 1.13722 5.12552 0.793615 4.04741 0.93575C3.84017 0.963073 3.77109 1.21223 3.9189 1.36004L5.16318 2.60432C5.86978 3.31093 5.86978 4.45657 5.16318 5.16318C4.45657 5.86978 3.31093 5.86978 2.60432 5.16318L1.36004 3.9189C1.21223 3.77109 0.963072 3.84017 0.93575 4.04741C0.793615 5.12552 1.13722 6.25493 1.96461 7.08232Z"
        fill="#666977"
      />
      <path
        d="M10.3628 10.3625C10.0095 10.7158 10.0095 11.2886 10.3628 11.6419C10.7161 11.9952 11.2889 11.9952 11.6422 11.6419C11.9955 11.2886 11.9955 10.7158 11.6422 10.3625C11.2889 10.0092 10.7161 10.0092 10.3628 10.3625Z"
        fill="#666977"
      />
    </svg>
  );
};
