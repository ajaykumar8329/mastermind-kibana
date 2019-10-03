/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import dateMath from '@elastic/datemath';
import {
  EuiSuperDatePicker,
  OnRefreshChangeProps,
  EuiSuperDatePickerRecentRange,
  OnRefreshProps,
  OnTimeChangeProps,
} from '@elastic/eui';
import { getOr, take } from 'lodash/fp';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { inputsModel, State } from '../../store';
import { inputsActions, timelineActions, hostsActions, networkActions } from '../../store/actions';
import { InputsModelId } from '../../store/inputs/constants';
import {
  policySelector,
  durationSelector,
  kindSelector,
  startSelector,
  endSelector,
  fromStrSelector,
  toStrSelector,
  isLoadingSelector,
  queriesSelector,
  kqlQuerySelector,
} from './selectors';
import { InputsRange, Policy } from '../../store/inputs/model';

const MAX_RECENTLY_USED_RANGES = 9;

interface SuperDatePickerStateRedux {
  duration: number;
  end: number;
  fromStr: string;
  isLoading: boolean;
  kind: string;
  kqlQuery: inputsModel.GlobalKqlQuery;
  policy: Policy['kind'];
  queries: inputsModel.GlobalGraphqlQuery[];
  start: number;
  toStr: string;
}

interface UpdateReduxTime extends OnTimeChangeProps {
  id: InputsModelId;
  kql?: inputsModel.GlobalKqlQuery | undefined;
  timelineId?: string;
}

interface ReturnUpdateReduxTime {
  kqlHasBeenUpdated: boolean;
}

type DispatchUpdateReduxTime = ({
  end,
  id,
  isQuickSelection,
  kql,
  start,
  timelineId,
}: UpdateReduxTime) => ReturnUpdateReduxTime;

interface SuperDatePickerDispatchProps {
  setDuration: ({ id, duration }: { id: InputsModelId; duration: number }) => void;
  startAutoReload: ({ id }: { id: InputsModelId }) => void;
  stopAutoReload: ({ id }: { id: InputsModelId }) => void;
  updateReduxTime: DispatchUpdateReduxTime;
}

interface OwnProps {
  disabled?: boolean;
  id: InputsModelId;
  timelineId?: string;
}

export type SuperDatePickerProps = OwnProps &
  SuperDatePickerDispatchProps &
  SuperDatePickerStateRedux;

export const SuperDatePickerComponent = React.memo<SuperDatePickerProps>(
  ({
    duration,
    end,
    fromStr,
    id,
    isLoading,
    kind,
    kqlQuery,
    policy,
    queries,
    setDuration,
    start,
    startAutoReload,
    stopAutoReload,
    timelineId,
    toStr,
    updateReduxTime,
  }) => {
    const [isQuickSelection, setIsQuickSelection] = useState(true);
    const [recentlyUsedRanges, setRecentlyUsedRanges] = useState<EuiSuperDatePickerRecentRange[]>(
      []
    );
    const onRefresh = ({ start: newStart, end: newEnd }: OnRefreshProps): void => {
      const { kqlHasBeenUpdated } = updateReduxTime({
        end: newEnd,
        id,
        isInvalid: false,
        isQuickSelection,
        kql: kqlQuery,
        start: newStart,
        timelineId,
      });
      const currentStart = formatDate(newStart);
      const currentEnd = isQuickSelection
        ? formatDate(newEnd, { roundUp: true })
        : formatDate(newEnd);
      if (
        !kqlHasBeenUpdated &&
        (!isQuickSelection || (start === currentStart && end === currentEnd))
      ) {
        refetchQuery(queries);
      }
    };

    const onRefreshChange = ({ isPaused, refreshInterval }: OnRefreshChangeProps): void => {
      if (duration !== refreshInterval) {
        setDuration({ id, duration: refreshInterval });
      }

      if (isPaused && policy === 'interval') {
        stopAutoReload({ id });
      } else if (!isPaused && policy === 'manual') {
        startAutoReload({ id });
      }

      if (!isPaused && (!isQuickSelection || (isQuickSelection && toStr !== 'now'))) {
        refetchQuery(queries);
      }
    };

    const refetchQuery = (newQueries: inputsModel.GlobalGraphqlQuery[]) => {
      newQueries.forEach(q => q.refetch && (q.refetch as inputsModel.Refetch)());
    };

    const onTimeChange = ({
      start: newStart,
      end: newEnd,
      isQuickSelection: newIsQuickSelection,
      isInvalid,
    }: OnTimeChangeProps) => {
      if (!isInvalid) {
        updateReduxTime({
          end: newEnd,
          id,
          isInvalid,
          isQuickSelection: newIsQuickSelection,
          kql: kqlQuery,
          start: newStart,
          timelineId,
        });
        const newRecentlyUsedRanges = [
          { start: newStart, end: newEnd },
          ...take(
            MAX_RECENTLY_USED_RANGES,
            recentlyUsedRanges.filter(
              recentlyUsedRange =>
                !(recentlyUsedRange.start === newStart && recentlyUsedRange.end === newEnd)
            )
          ),
        ];

        setRecentlyUsedRanges(newRecentlyUsedRanges);
        setIsQuickSelection(newIsQuickSelection);
      }
    };
    const endDate = kind === 'relative' ? toStr : new Date(end).toISOString();
    const startDate = kind === 'relative' ? fromStr : new Date(start).toISOString();

    return (
      <EuiSuperDatePicker
        end={endDate}
        isLoading={isLoading}
        isPaused={policy === 'manual'}
        onRefresh={onRefresh}
        onRefreshChange={onRefreshChange}
        onTimeChange={onTimeChange}
        recentlyUsedRanges={recentlyUsedRanges}
        refreshInterval={duration}
        showUpdateButton={true}
        start={startDate}
      />
    );
  }
);

const formatDate = (
  date: string,
  options?: {
    roundUp?: boolean;
  }
) => {
  const momentDate = dateMath.parse(date, options);
  return momentDate != null && momentDate.isValid() ? momentDate.valueOf() : 0;
};

const dispatchUpdateReduxTime = (dispatch: Dispatch) => ({
  end,
  id,
  isQuickSelection,
  kql,
  start,
  timelineId,
}: UpdateReduxTime): ReturnUpdateReduxTime => {
  const fromDate = formatDate(start);
  let toDate = formatDate(end, { roundUp: true });
  if (isQuickSelection) {
    dispatch(
      inputsActions.setRelativeRangeDatePicker({
        id,
        fromStr: start,
        toStr: end,
        from: fromDate,
        to: toDate,
      })
    );
  } else {
    toDate = formatDate(end);
    dispatch(
      inputsActions.setAbsoluteRangeDatePicker({
        id,
        from: formatDate(start),
        to: formatDate(end),
      })
    );
  }
  if (timelineId != null) {
    dispatch(
      timelineActions.updateRange({
        id: timelineId,
        start: fromDate,
        end: toDate,
      })
    );
  }

  let kqlHasBeenUpdated = false;
  if (kql) {
    // if refetch is successful, it will have a side effect
    // to set all the tables on its activePage to zero (meaning pagination)
    kqlHasBeenUpdated = kql.refetch(dispatch);
  }
  if (!kqlHasBeenUpdated) {
    // Date picker is global to all the page in the app
    // (Hosts/Network are the only one having tables)
    dispatch(hostsActions.setHostTablesActivePageToZero());
    dispatch(networkActions.setNetworkTablesActivePageToZero());
  }

  return { kqlHasBeenUpdated };
};

export const makeMapStateToProps = () => {
  const getDurationSelector = durationSelector();
  const getEndSelector = endSelector();
  const getFromStrSelector = fromStrSelector();
  const getIsLoadingSelector = isLoadingSelector();
  const getKindSelector = kindSelector();
  const getKqlQuerySelector = kqlQuerySelector();
  const getPolicySelector = policySelector();
  const getQueriesSelector = queriesSelector();
  const getStartSelector = startSelector();
  const getToStrSelector = toStrSelector();
  return (state: State, { id }: OwnProps) => {
    const inputsRange: InputsRange = getOr({}, `inputs.${id}`, state);
    return {
      duration: getDurationSelector(inputsRange),
      end: getEndSelector(inputsRange),
      fromStr: getFromStrSelector(inputsRange),
      isLoading: getIsLoadingSelector(inputsRange),
      kind: getKindSelector(inputsRange),
      kqlQuery: getKqlQuerySelector(inputsRange),
      policy: getPolicySelector(inputsRange),
      queries: getQueriesSelector(inputsRange),
      start: getStartSelector(inputsRange),
      toStr: getToStrSelector(inputsRange),
    };
  };
};

SuperDatePickerComponent.displayName = 'SuperDatePickerComponent';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  startAutoReload: ({ id }: { id: InputsModelId }) =>
    dispatch(inputsActions.startAutoReload({ id })),
  stopAutoReload: ({ id }: { id: InputsModelId }) => dispatch(inputsActions.stopAutoReload({ id })),
  setDuration: ({ id, duration }: { id: InputsModelId; duration: number }) =>
    dispatch(inputsActions.setDuration({ id, duration })),
  updateReduxTime: dispatchUpdateReduxTime(dispatch),
});

export const SuperDatePicker = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SuperDatePickerComponent);
