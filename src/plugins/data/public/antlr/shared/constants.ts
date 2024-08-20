/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IndexPattern } from '../..';

export const testingIndex = ({
  title: 'opensearch_dashboards_sample_data_flights',
  fields: [
    {
      count: 0,
      name: 'Carrier',
      displayName: 'Carrier',
      type: 'string',
      esTypes: ['keyword'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 2,
      name: 'DestCityName',
      displayName: 'DestCityName',
      type: 'string',
      esTypes: ['keyword'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: 'DestCountry',
      displayName: 'DestCountry',
      type: 'string',
      esTypes: ['keyword'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: 'DestWeather',
      displayName: 'DestWeather',
      type: 'string',
      esTypes: ['keyword'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: 'DistanceMiles',
      displayName: 'DistanceMiles',
      type: 'number',
      esTypes: ['float'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: 'FlightDelay',
      displayName: 'FlightDelay',
      type: 'boolean',
      esTypes: ['boolean'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: 'FlightNum',
      displayName: 'FlightNum',
      type: 'string',
      esTypes: ['keyword'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: 'OriginWeather',
      displayName: 'OriginWeather',
      type: 'string',
      esTypes: ['keyword'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
      subType: undefined,
    },
    {
      count: 0,
      name: '_id',
      displayName: '_id',
      type: 'string',
      esTypes: ['_id'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: false,
      subType: undefined,
    },
    {
      count: 0,
      name: '_index',
      displayName: '_index',
      type: 'string',
      esTypes: ['_index'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: false,
      subType: undefined,
    },
    {
      count: 0,
      name: '_score',
      displayName: '_score',
      type: 'number',
      scripted: false,
      searchable: false,
      aggregatable: false,
      readFromDocValues: false,
      subType: undefined,
    },
    {
      count: 0,
      name: '_source',
      displayName: '_source',
      type: '_source',
      esTypes: ['_source'],
      scripted: false,
      searchable: false,
      aggregatable: false,
      readFromDocValues: false,
      subType: undefined,
    },
    {
      count: 0,
      name: '_type',
      displayName: '_type',
      type: 'string',
      esTypes: ['_type'],
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: false,
      subType: undefined,
    },
  ],
} as unknown) as IndexPattern;

export const booleanOperatorSuggestions = [
  { text: 'or', type: 17 },
  { text: 'and', type: 17 },
];

export const notOperatorSuggestion = { text: 'not', type: 17 };

export const fieldNameSuggestions: Array<{ text: string; type: number; insertText?: string }> = [
  { text: 'Carrier', type: 3, insertText: 'Carrier: ' },
  { text: 'DestCityName', type: 3, insertText: 'DestCityName: ' },
  { text: 'DestCountry', type: 3, insertText: 'DestCountry: ' },
  { text: 'DestWeather', type: 3, insertText: 'DestWeather: ' },
  { text: 'DistanceMiles', type: 3, insertText: 'DistanceMiles: ' },
  { text: 'FlightDelay', type: 3, insertText: 'FlightDelay: ' },
  { text: 'FlightNum', type: 3, insertText: 'FlightNum: ' },
  { text: 'OriginWeather', type: 3, insertText: 'OriginWeather: ' },
  { text: '_id', type: 3, insertText: '_id: ' },
  { text: '_index', type: 3, insertText: '_index: ' },
  { text: '_score', type: 3, insertText: '_score: ' },
  { text: '_source', type: 3, insertText: '_source: ' },
  { text: '_type', type: 3, insertText: '_type: ' },
];

export const fieldNameWithNotSuggestions = fieldNameSuggestions.concat(notOperatorSuggestion);

// suggestion item details tags
export const enum SuggestionItemDetailsTags {
  Keyword = 'Keyword',
  AggregateFunction = 'Aggregate Function',
}
