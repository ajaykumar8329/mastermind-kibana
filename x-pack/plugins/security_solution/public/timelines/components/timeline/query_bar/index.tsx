/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { isEmpty } from 'lodash/fp';
import React, { memo, useCallback, useState, useEffect } from 'react';
import { Subscription } from 'rxjs';
import deepEqual from 'fast-deep-equal';

import {
  IIndexPattern,
  Query,
  Filter,
  esFilters,
  FilterManager,
  SavedQuery,
  SavedQueryTimeFilter,
} from '../../../../../../../../src/plugins/data/public';

import { BrowserFields } from '../../../../common/containers/source';
import { convertKueryToElasticSearchQuery } from '../../../../common/lib/keury';
import { KueryFilterQuery, KueryFilterQueryKind } from '../../../../common/store';
import { KqlMode } from '../../../../timelines/store/timeline/model';
import { useSavedQueryServices } from '../../../../common/utils/saved_query_services';
import { DispatchUpdateReduxTime } from '../../../../common/components/super_date_picker';
import { QueryBar } from '../../../../common/components/query_bar';
import { DataProvider } from '../data_providers/data_provider';
import { buildGlobalQuery } from '../helpers';

export interface QueryBarTimelineComponentProps {
  applyKqlFilterQuery: (expression: string, kind: KueryFilterQueryKind) => void;
  browserFields: BrowserFields;
  dataProviders: DataProvider[];
  filters: Filter[];
  filterManager: FilterManager;
  filterQuery: KueryFilterQuery;
  filterQueryDraft: KueryFilterQuery;
  from: string;
  fromStr: string;
  kqlMode: KqlMode;
  indexPattern: IIndexPattern;
  isRefreshPaused: boolean;
  refreshInterval: number;
  savedQueryId: string | null;
  setFilters: (filters: Filter[]) => void;
  setKqlFilterQueryDraft: (expression: string, kind: KueryFilterQueryKind) => void;
  setSavedQueryId: (savedQueryId: string | null) => void;
  timelineId: string;
  to: string;
  toStr: string;
  updateReduxTime: DispatchUpdateReduxTime;
}

export const TIMELINE_FILTER_DROP_AREA = 'timeline-filter-drop-area';

const getNonDropAreaFilters = (filters: Filter[] = []) =>
  filters.filter((f: Filter) => f.meta.controlledBy !== TIMELINE_FILTER_DROP_AREA);

export const QueryBarTimeline = memo<QueryBarTimelineComponentProps>(
  ({
    applyKqlFilterQuery,
    browserFields,
    dataProviders,
    filters,
    filterManager,
    filterQuery,
    filterQueryDraft,
    from,
    fromStr,
    kqlMode,
    indexPattern,
    isRefreshPaused,
    savedQueryId,
    setFilters,
    setKqlFilterQueryDraft,
    setSavedQueryId,
    refreshInterval,
    timelineId,
    to,
    toStr,
    updateReduxTime,
  }) => {
    const [dateRangeFrom, setDateRangeFrom] = useState<string>(
      fromStr != null ? fromStr : new Date(from).toISOString()
    );
    const [dateRangeTo, setDateRangTo] = useState<string>(
      toStr != null ? toStr : new Date(to).toISOString()
    );

    const [savedQuery, setSavedQuery] = useState<SavedQuery | null>(null);
    const [filterQueryConverted, setFilterQueryConverted] = useState<Query>({
      query: filterQuery != null ? filterQuery.expression : '',
      language: filterQuery != null ? filterQuery.kind : 'kuery',
    });
    const [queryBarFilters, setQueryBarFilters] = useState<Filter[]>(
      getNonDropAreaFilters(filters)
    );
    const [dataProvidersDsl, setDataProvidersDsl] = useState<string>(
      convertKueryToElasticSearchQuery(buildGlobalQuery(dataProviders, browserFields), indexPattern)
    );
    const savedQueryServices = useSavedQueryServices();

    useEffect(() => {
      let isSubscribed = true;
      const subscriptions = new Subscription();
      filterManager.setFilters(filters);

      subscriptions.add(
        filterManager.getUpdates$().subscribe({
          next: () => {
            if (isSubscribed) {
              const filterWithoutDropArea = getNonDropAreaFilters(filterManager.getFilters());
              setFilters(filterWithoutDropArea);
              setQueryBarFilters(filterWithoutDropArea);
            }
          },
        })
      );

      return () => {
        isSubscribed = false;
        subscriptions.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const filterWithoutDropArea = getNonDropAreaFilters(filterManager.getFilters());
      if (!deepEqual(filters, filterWithoutDropArea)) {
        filterManager.setFilters(filters);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    useEffect(() => {
      setFilterQueryConverted({
        query: filterQuery != null ? filterQuery.expression : '',
        language: filterQuery != null ? filterQuery.kind : 'kuery',
      });
    }, [filterQuery]);

    useEffect(() => {
      setDataProvidersDsl(
        convertKueryToElasticSearchQuery(
          buildGlobalQuery(dataProviders, browserFields),
          indexPattern
        )
      );
    }, [dataProviders, browserFields, indexPattern]);

    useEffect(() => {
      if (fromStr != null && toStr != null) {
        setDateRangeFrom(fromStr);
        setDateRangTo(toStr);
      } else if (from != null && to != null) {
        setDateRangeFrom(new Date(from).toISOString());
        setDateRangTo(new Date(to).toISOString());
      }
    }, [from, fromStr, to, toStr]);

    useEffect(() => {
      let isSubscribed = true;
      async function setSavedQueryByServices() {
        if (savedQueryId != null && savedQueryServices != null) {
          try {
            // The getSavedQuery function will throw a promise rejection in
            // src/legacy/core_plugins/data/public/search/search_bar/lib/saved_query_service.ts
            // if the savedObjectsClient is undefined. This is happening in a test
            // so I wrapped this in a try catch to keep the unhandled promise rejection
            // warning from appearing in tests.
            const mySavedQuery = await savedQueryServices.getSavedQuery(savedQueryId);
            if (isSubscribed && mySavedQuery != null) {
              setSavedQuery({
                ...mySavedQuery,
                attributes: {
                  ...mySavedQuery.attributes,
                  filters: getNonDropAreaFilters(filters),
                },
              });
            }
          } catch (exc) {
            setSavedQuery(null);
          }
        } else if (isSubscribed) {
          setSavedQuery(null);
        }
      }
      setSavedQueryByServices();
      return () => {
        isSubscribed = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedQueryId]);

    const onChangedQuery = useCallback(
      (newQuery: Query) => {
        if (
          filterQueryDraft == null ||
          (filterQueryDraft != null && filterQueryDraft.expression !== newQuery.query) ||
          filterQueryDraft.kind !== newQuery.language
        ) {
          setKqlFilterQueryDraft(
            newQuery.query as string,
            newQuery.language as KueryFilterQueryKind
          );
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [filterQueryDraft]
    );

    const onSubmitQuery = useCallback(
      (newQuery: Query, timefilter?: SavedQueryTimeFilter) => {
        if (
          filterQuery == null ||
          (filterQuery != null && filterQuery.expression !== newQuery.query) ||
          filterQuery.kind !== newQuery.language
        ) {
          setKqlFilterQueryDraft(
            newQuery.query as string,
            newQuery.language as KueryFilterQueryKind
          );
          applyKqlFilterQuery(newQuery.query as string, newQuery.language as KueryFilterQueryKind);
        }
        if (timefilter != null) {
          const isQuickSelection = timefilter.from.includes('now') || timefilter.to.includes('now');

          updateReduxTime({
            id: 'timeline',
            end: timefilter.to,
            start: timefilter.from,
            isInvalid: false,
            isQuickSelection,
            timelineId,
          });
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [filterQuery, timelineId]
    );

    const onSavedQuery = useCallback(
      (newSavedQuery: SavedQuery | null) => {
        if (newSavedQuery != null) {
          if (newSavedQuery.id !== savedQueryId) {
            setSavedQueryId(newSavedQuery.id);
          }
          if (savedQueryServices != null && dataProvidersDsl !== '') {
            const dataProviderFilterExists =
              newSavedQuery.attributes.filters != null
                ? newSavedQuery.attributes.filters.findIndex(
                    (f) => f.meta.controlledBy === TIMELINE_FILTER_DROP_AREA
                  )
                : -1;
            savedQueryServices.saveQuery(
              {
                ...newSavedQuery.attributes,
                filters:
                  newSavedQuery.attributes.filters != null
                    ? dataProviderFilterExists > -1
                      ? [
                          ...newSavedQuery.attributes.filters.slice(0, dataProviderFilterExists),
                          getDataProviderFilter(dataProvidersDsl),
                          ...newSavedQuery.attributes.filters.slice(dataProviderFilterExists + 1),
                        ]
                      : [
                          ...newSavedQuery.attributes.filters,
                          getDataProviderFilter(dataProvidersDsl),
                        ]
                    : [],
              },
              {
                overwrite: true,
              }
            );
          }
        } else {
          setSavedQueryId(null);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dataProvidersDsl, savedQueryId, savedQueryServices]
    );

    return (
      <QueryBar
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        hideSavedQuery={kqlMode === 'search'}
        indexPattern={indexPattern}
        isRefreshPaused={isRefreshPaused}
        filterQuery={filterQueryConverted}
        filterQueryDraft={filterQueryDraft}
        filterManager={filterManager}
        filters={queryBarFilters}
        onChangedQuery={onChangedQuery}
        onSubmitQuery={onSubmitQuery}
        refreshInterval={refreshInterval}
        savedQuery={savedQuery}
        onSavedQuery={onSavedQuery}
        dataTestSubj={'timelineQueryInput'}
      />
    );
  }
);

export const getDataProviderFilter = (dataProviderDsl: string): Filter => {
  const dslObject = JSON.parse(dataProviderDsl);
  const key = Object.keys(dslObject);
  return {
    ...dslObject,
    meta: {
      alias: TIMELINE_FILTER_DROP_AREA,
      controlledBy: TIMELINE_FILTER_DROP_AREA,
      negate: false,
      disabled: false,
      type: 'custom',
      key: isEmpty(key) ? 'bool' : key[0],
      value: dataProviderDsl,
    },
    $state: {
      store: esFilters.FilterStateStore.APP_STATE,
    },
  };
};
