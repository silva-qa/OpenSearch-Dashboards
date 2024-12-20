/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MiscUtils } from '@opensearch-dashboards-test/opensearch-dashboards-test-library';
import { DATA_EXPLORER_PAGE_ELEMENTS } from '../../../../../utils/dashboards/data_explorer/elements.js';
import {
  DATASOURCE_NAME,
  INDEX_NAME,
  INDEX_PATTERN_NAME,
  SEARCH_ABSOLUTE_START_DATE,
  SEARCH_ABSOLUTE_END_DATE,
} from './constants.js';
import './helpers.js';

const miscUtils = new MiscUtils(cy);

function selectDataSet(datasetType, language) {
  switch (datasetType) {
    case 'index':
      selectIndexDataset(DATASOURCE_NAME, INDEX_NAME, language);
      break;
    case 'index_pattern':
      selectIndexPatternDataset(INDEX_PATTERN_NAME, language);
      break;
  }
}

function setDateRange(datasetType, language) {
  switch (datasetType) {
    case 'index_pattern':
      if (language !== 'OpenSearch SQL') {
        cy.setSearchAbsoluteDateRange(SEARCH_ABSOLUTE_START_DATE, SEARCH_ABSOLUTE_END_DATE);
      }
      break;
  }
}

function checkTableFieldFilterActions(datasetType, language, shouldExist) {
  selectDataSet(datasetType, language);
  setDateRange(datasetType, language);

  cy.getElementByTestId('discoverQueryHits').should('not.exist'); // To ensure it waits until a full table is loaded into the DOM, instead of a bug where table only has 1 hit.

  verifyDocTableRowFilterForAndOutButton(0, shouldExist);

  if (shouldExist) {
    verifyDocTableFilterAction(
      0,
      DATA_EXPLORER_PAGE_ELEMENTS.TABLE_FIELD_FILTER_FOR_BUTTON,
      '10,000',
      '1',
      true
    );
    verifyDocTableFilterAction(
      0,
      DATA_EXPLORER_PAGE_ELEMENTS.TABLE_FIELD_FILTER_OUT_BUTTON,
      '10,000',
      '9,999',
      false
    );
  }
}

function checkExpandedTableFilterActions(datasetType, language, isEnabled) {
  selectDataSet(datasetType, language);
  setDateRange(datasetType, language);

  cy.getElementByTestId('discoverQueryHits').should('not.exist'); // To ensure it waits until a full table is loaded into the DOM, instead of a bug where table only has 1 hit.
  toggleDocTableRow(0);
  verifyDocTableFirstExpandedFieldFirstRowFilterForFilterOutExistsFilterButtons(isEnabled);
  verifyDocTableFirstExpandedFieldFirstRowToggleColumnButtonHasIntendedBehavior();

  if (isEnabled) {
    verifyDocTableFirstExpandedFieldFirstRowFilterForButtonFiltersCorrectField(0, 0, '10,000', '1');
    verifyDocTableFirstExpandedFieldFirstRowFilterOutButtonFiltersCorrectField(
      0,
      0,
      '10,000',
      '9,999'
    );
    verifyDocTableFirstExpandedFieldFirstRowExistsFilterButtonFiltersCorrectField(
      0,
      0,
      '10,000',
      '10,000'
    );
  }
}

describe('filter for value spec', () => {
  beforeEach(() => {
    cy.localLogin(Cypress.env('username'), Cypress.env('password'));
    miscUtils.visitPage('app/data-explorer/discover');
    cy.getNewSearchButton().click();
  });
  describe('filter actions in table field', () => {
    describe('index pattern dataset', () => {
      // filter actions should exist for DQL
      it('DQL', () => {
        checkTableFieldFilterActions('index_pattern', 'DQL', true);
      });
      // filter actions should exist for Lucene
      it('Lucene', () => {
        checkTableFieldFilterActions('index_pattern', 'Lucene', true);
      });
      // filter actions should not exist for SQL
      it('SQL', () => {
        checkTableFieldFilterActions('index_pattern', 'OpenSearch SQL', false);
      });
      // filter actions should not exist for PPL
      it('PPL', () => {
        checkTableFieldFilterActions('index_pattern', 'PPL', false);
      });
    });
    describe('index dataset', () => {
      // filter actions should not exist for SQL
      it('SQL', () => {
        checkTableFieldFilterActions('index', 'OpenSearch SQL', false);
      });
      // filter actions should not exist for PPL
      it('PPL', () => {
        checkTableFieldFilterActions('index', 'PPL', false);
      });
    });
  });

  describe('filter actions in expanded table', () => {
    describe('index pattern dataset', () => {
      // filter actions should exist for DQL
      it('DQL', () => {
        checkExpandedTableFilterActions('index_pattern', 'DQL', true);
      });
      // filter actions should exist for Lucene
      it('Lucene', () => {
        checkExpandedTableFilterActions('index_pattern', 'Lucene', true);
      });
      // filter actions should not exist for SQL
      it('SQL', () => {
        checkExpandedTableFilterActions('index_pattern', 'OpenSearch SQL', false);
      });
      // filter actions should not exist for PPL
      it('PPL', () => {
        checkExpandedTableFilterActions('index_pattern', 'PPL', false);
      });
    });
    describe('index dataset', () => {
      // filter actions should not exist for SQL
      it('SQL', () => {
        checkExpandedTableFilterActions('index', 'OpenSearch SQL', false);
      });
      // filter actions should not exist for PPL
      it('PPL', () => {
        checkExpandedTableFilterActions('index', 'OpenSearch SQL', false);
      });
    });
  });
});
