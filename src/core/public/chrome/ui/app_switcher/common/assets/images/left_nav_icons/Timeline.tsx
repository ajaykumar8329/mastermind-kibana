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

export const Timeline = ({ ...props }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="#666977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 4.5C7 4.63261 7.05268 4.75979 7.14645 4.85355C7.24021 4.94732 7.36739 5 7.5 5C7.63261 5 7.75979 4.94732 7.85355 4.85355C7.94732 4.75979 8 4.63261 8 4.5V4H9C9.26522 4 9.51957 3.89464 9.70711 3.70711C9.89464 3.51957 10 3.26522 10 3V1C10 0.734784 9.89464 0.48043 9.70711 0.292893C9.51957 0.105357 9.26522 0 9 0L6 0C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V3C5 3.26522 5.10536 3.51957 5.29289 3.70711C5.48043 3.89464 5.73478 4 6 4H7V4.5ZM9 1H6V3H9V1ZM2 7.5C2 7.36739 2.05268 7.24021 2.14645 7.14645C2.24021 7.05268 2.36739 7 2.5 7C2.63261 7 2.75979 7.05268 2.85355 7.14645C2.94732 7.24021 3 7.36739 3 7.5C3 7.63261 2.94732 7.75979 2.85355 7.85355C2.75979 7.94732 2.63261 8 2.5 8C2.36739 8 2.24021 7.94732 2.14645 7.85355C2.05268 7.75979 2 7.63261 2 7.5ZM2.5 9C2.18967 9.00016 1.88694 8.90407 1.63351 8.72497C1.38008 8.54587 1.18844 8.29258 1.085 8H0.5C0.367392 8 0.240215 7.94732 0.146447 7.85355C0.0526784 7.75979 0 7.63261 0 7.5C0 7.36739 0.0526784 7.24021 0.146447 7.14645C0.240215 7.05268 0.367392 7 0.5 7H1.085C1.18807 6.70701 1.37955 6.45323 1.63301 6.27371C1.88647 6.09419 2.1894 5.99777 2.5 5.99777C2.8106 5.99777 3.11353 6.09419 3.36699 6.27371C3.62045 6.45323 3.81193 6.70701 3.915 7H6.085C6.18807 6.70701 6.37955 6.45323 6.63301 6.27371C6.88647 6.09419 7.1894 5.99777 7.5 5.99777C7.8106 5.99777 8.11353 6.09419 8.36699 6.27371C8.62045 6.45323 8.81193 6.70701 8.915 7H11.085C11.1881 6.70701 11.3796 6.45323 11.633 6.27371C11.8865 6.09419 12.1894 5.99777 12.5 5.99777C12.8106 5.99777 13.1135 6.09419 13.367 6.27371C13.6204 6.45323 13.8119 6.70701 13.915 7H14.5C14.6326 7 14.7598 7.05268 14.8536 7.14645C14.9473 7.24021 15 7.36739 15 7.5C15 7.63261 14.9473 7.75979 14.8536 7.85355C14.7598 7.94732 14.6326 8 14.5 8H13.915C13.8119 8.29299 13.6204 8.54677 13.367 8.72629C13.1135 8.90581 12.8106 9.00223 12.5 9.00223C12.1894 9.00223 11.8865 8.90581 11.633 8.72629C11.3796 8.54677 11.1881 8.29299 11.085 8H8.915C8.81193 8.29299 8.62045 8.54677 8.36699 8.72629C8.11353 8.90581 7.8106 9.00223 7.5 9.00223C7.1894 9.00223 6.88647 8.90581 6.63301 8.72629C6.37955 8.54677 6.18807 8.29299 6.085 8H3.915C3.81156 8.29258 3.61992 8.54587 3.36649 8.72497C3.11306 8.90407 2.81033 9.00016 2.5 9ZM13 7.5C13 7.36739 12.9473 7.24021 12.8536 7.14645C12.7598 7.05268 12.6326 7 12.5 7C12.3674 7 12.2402 7.05268 12.1464 7.14645C12.0527 7.24021 12 7.36739 12 7.5C12 7.63261 12.0527 7.75979 12.1464 7.85355C12.2402 7.94732 12.3674 8 12.5 8C12.6326 8 12.7598 7.94732 12.8536 7.85355C12.9473 7.75979 13 7.63261 13 7.5ZM8 7.5C8 7.36739 7.94732 7.24021 7.85355 7.14645C7.75979 7.05268 7.63261 7 7.5 7C7.36739 7 7.24021 7.05268 7.14645 7.14645C7.05268 7.24021 7 7.36739 7 7.5C7 7.63261 7.05268 7.75979 7.14645 7.85355C7.24021 7.94732 7.36739 8 7.5 8C7.63261 8 7.75979 7.94732 7.85355 7.85355C7.94732 7.75979 8 7.63261 8 7.5ZM2.5 10C2.36739 10 2.24021 10.0527 2.14645 10.1464C2.05268 10.2402 2 10.3674 2 10.5V11H1C0.734784 11 0.48043 11.1054 0.292893 11.2929C0.105357 11.4804 0 11.7348 0 12L0 14C0 14.2652 0.105357 14.5196 0.292893 14.7071C0.48043 14.8946 0.734784 15 1 15H4C4.26522 15 4.51957 14.8946 4.70711 14.7071C4.89464 14.5196 5 14.2652 5 14V12C5 11.7348 4.89464 11.4804 4.70711 11.2929C4.51957 11.1054 4.26522 11 4 11H3V10.5C3 10.3674 2.94732 10.2402 2.85355 10.1464C2.75979 10.0527 2.63261 10 2.5 10ZM4 14V12H1V14H4ZM12 10.5C12 10.3674 12.0527 10.2402 12.1464 10.1464C12.2402 10.0527 12.3674 10 12.5 10C12.6326 10 12.7598 10.0527 12.8536 10.1464C12.9473 10.2402 13 10.3674 13 10.5V11H14C14.2652 11 14.5196 11.1054 14.7071 11.2929C14.8946 11.4804 15 11.7348 15 12V14C15 14.2652 14.8946 14.5196 14.7071 14.7071C14.5196 14.8946 14.2652 15 14 15H11C10.7348 15 10.4804 14.8946 10.2929 14.7071C10.1054 14.5196 10 14.2652 10 14V12C10 11.7348 10.1054 11.4804 10.2929 11.2929C10.4804 11.1054 10.7348 11 11 11H12V10.5ZM14 13V14H11V12H14V13Z"
        fill="#666977"
      />
    </svg>
  );
};
