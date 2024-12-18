/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH } from './constants';

// This function does not delete all indices
Cypress.Commands.add('deleteAllIndices', () => {
  cy.log('Deleting all indices');
  cy.request(
    'DELETE',
    `${Cypress.env('openSearchUrl')}/index*,sample*,opensearch_dashboards*,test*,cypress*`
  );
});

import {
  MiscUtils,
  LoginPage,
} from '@opensearch-dashboards-test/opensearch-dashboards-test-library';

const miscUtils = new MiscUtils(cy);
const loginPage = new LoginPage(cy);

/**
 * Get DOM element by data-test-subj id.
 */
Cypress.Commands.add('getElementByTestId', (testId, options = {}) => {
  return cy.get(`[data-test-subj="${testId}"]`, options);
});

/**
 * Get multiple DOM elements by data-test-subj ids.
 */
Cypress.Commands.add('getElementsByTestIds', (testIds, options = {}) => {
  const selectors = [testIds].flat(Infinity).map((testId) => `[data-test-subj="${testId}"]`);
  return cy.get(selectors.join(','), options);
});

/**
 * Get DOM elements with a data-test-subj id containing the testId.
 * @param testId data-test-subj value.
 * @param options get options. Default: {}
 * @example
 * // returns all DOM elements that has a data-test-subj including the string 'table'
 * cy.getElementsByTestIdLike('table')
 */
Cypress.Commands.add('getElementsByTestIdLike', (partialTestId, options = {}) => {
  return cy.get(`[data-test-subj*="${partialTestId}"]`, options);
});

/**
 * Find DOM elements with a data-test-subj id containing the testId.
 * @param testId data-test-subj value.
 * @param options get options. Default: {}
 * @example
 * // returns all DOM elements that has a data-test-subj including the string 'table'
 * cy.findElementsByTestIdLike('table')
 */
Cypress.Commands.add(
  'findElementsByTestIdLike',
  { prevSubject: true },
  (subject, partialTestId, options = {}) => {
    return cy.wrap(subject).find(`[data-test-subj*="${partialTestId}"]`, options);
  }
);

/**
 * Find DOM element with a data-test-subj id containing the testId.
 * @param testId data-test-subj value.
 * @param options get options. Default: {}
 * @example
 * // returns all DOM elements that has a data-test-subj including the string 'table'
 * cy.findElementsByTestIdLike('table')
 */
Cypress.Commands.add(
  'findElementByTestId',
  { prevSubject: true },
  (subject, partialTestId, options = {}) => {
    return cy.wrap(subject).find(`[data-test-subj="${partialTestId}"]`, options);
  }
);

/**
 * Find element from previous chained element by data-test-subj id.
 */
Cypress.Commands.add(
  'findElementByTestId',
  { prevSubject: true },
  (subject, testId, options = {}) => {
    return cy.wrap(subject).find(`[data-test-subj="${testId}"]`, options);
  }
);

/**
 * Go to the local instance of OSD's home page and login if needed.
 */
Cypress.Commands.add('localLogin', (username, password) => {
  miscUtils.visitPage('/app/home');
  cy.url().then(($url) => {
    if ($url.includes('login')) {
      loginPage.enterUserName(username);
      loginPage.enterPassword(password);
      loginPage.submit();
    }
    cy.url().should('contain', '/app/home');
  });
});

Cypress.Commands.add('getElementByDataTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('whenTestIdNotFound', (testIds, callbackFn, options = {}) => {
  const selectors = [testIds].flat(Infinity).map((testId) => `[data-test-subj="${testId}"]`);
  cy.get('body', options).then(($body) => {
    if ($body.find(selectors.join(',')).length === 0) callbackFn();
  });
});

Cypress.Commands.add('createIndex', (index, policyID = null, settings = {}) => {
  cy.request('PUT', `${Cypress.env('openSearchUrl')}/${index}`, settings);
  if (policyID != null) {
    const body = { policy_id: policyID };

    cy.request('POST', `${Cypress.env('openSearchUrl')}${IM_API.ADD_POLICY_BASE}/${index}`, body);
  }
});

Cypress.Commands.add('deleteIndex', (indexName, options = {}) => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('openSearchUrl')}/${indexName}`,
    failOnStatusCode: false,
    ...options,
  });
});

Cypress.Commands.add('getIndices', (index = null, settings = {}) => {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('openSearchUrl')}/_cat/indices/${index ? index : ''}`,
    failOnStatusCode: false,
    ...settings,
  });
});

// TODO: Impliment chunking
Cypress.Commands.add('bulkUploadDocs', (fixturePath, index) => {
  const sendBulkAPIRequest = (ndjson) => {
    const url = index
      ? `${Cypress.env('openSearchUrl')}/${index}/_bulk`
      : `${Cypress.env('openSearchUrl')}/_bulk`;
    cy.log('bulkUploadDocs')
      .request({
        method: 'POST',
        url,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'osd-xsrf': true,
        },
        body: ndjson,
      })
      .then((response) => {
        if (response.body.errors) {
          console.error(response.body.items);
          throw new Error('Bulk upload failed');
        }
      });
  };

  cy.fixture(fixturePath, 'utf8').then((ndjson) => {
    sendBulkAPIRequest(ndjson);
  });

  cy.request({
    method: 'POST',
    url: `${Cypress.env('openSearchUrl')}/_all/_refresh`,
  });
});

Cypress.Commands.add('importSavedObjects', (fixturePath, overwrite = true) => {
  const sendImportRequest = (ndjson) => {
    const url = `${Cypress.config().baseUrl}/api/saved_objects/_import?${
      overwrite ? `overwrite=true` : ''
    }`;

    const formData = new FormData();
    formData.append('file', ndjson, 'savedObject.ndjson');

    cy.log('importSavedObject')
      .request({
        method: 'POST',
        url,
        headers: {
          'content-type': 'multipart/form-data',
          'osd-xsrf': true,
        },
        body: formData,
      })
      .then((response) => {
        if (response.body.errors) {
          console.error(response.body.items);
          throw new Error('Import failed');
        }
      });
  };

  cy.fixture(fixturePath)
    .then((file) => Cypress.Blob.binaryStringToBlob(file))
    .then((ndjson) => {
      sendImportRequest(ndjson);
    });
});

Cypress.Commands.add('deleteSavedObject', (type, id, options = {}) => {
  const url = `${Cypress.config().baseUrl}/api/saved_objects/${type}/${id}`;

  return cy.request({
    method: 'DELETE',
    url,
    headers: {
      'osd-xsrf': true,
    },
    failOnStatusCode: false,
    ...options,
  });
});

Cypress.Commands.add('deleteSavedObjectByType', (type, search) => {
  const searchParams = new URLSearchParams({
    fields: 'id',
    type,
  });

  if (search) {
    searchParams.set('search', search);
  }

  const url = `${
    Cypress.config().baseUrl
  }/api/opensearch-dashboards/management/saved_objects/_find?${searchParams.toString()}`;

  return cy.request(url).then((response) => {
    console.log('response', response);
    response.body.saved_objects.map(({ type, id }) => {
      cy.deleteSavedObject(type, id);
    });
  });
});

// TODO: we should really make this a helper function that if the data source does not exist, it creates it so take what you have for the dataset selector spec and move it here
Cypress.Commands.add('ifDataSourceExists', (search) => {
  const searchParams = new URLSearchParams({
    fields: 'id',
    type: 'data-source',
  });

  if (search) {
    searchParams.set('search', search);
  }

  const url = `${
    Cypress.config().baseUrl
  }/api/opensearch-dashboards/management/saved_objects/_find?${searchParams.toString()}`;

  return cy.request(url).then((response) => {
    console.log('response', response);
    return response.body.saved_objects.length > 0;
  });
});

Cypress.Commands.add('createIndexPattern', (id, attributes, header = {}) => {
  const url = `${Cypress.config().baseUrl}/api/saved_objects/index-pattern/${id}`;

  cy.request({
    method: 'POST',
    url,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'osd-xsrf': true,
      ...header,
    },
    body: JSON.stringify({
      attributes,
      references: [],
    }),
  });
});

Cypress.Commands.add('createDashboard', (attributes = {}, headers = {}) => {
  const url = `${Cypress.config().baseUrl}/api/saved_objects/dashboard`;

  cy.request({
    method: 'POST',
    url,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'osd-xsrf': true,
      ...headers,
    },
    body: JSON.stringify({
      attributes,
    }),
  });
});

Cypress.Commands.add('changeDefaultTenant', (attributes, header = {}) => {
  const url = Cypress.env('openSearchUrl') + '/_plugins/_security/api/tenancy/config';

  cy.request({
    method: 'PUT',
    url,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'osd-xsrf': true,
      ...header,
    },
    body: JSON.stringify(attributes),
  });
});

Cypress.Commands.add('deleteIndexPattern', (id, options = {}) =>
  cy.deleteSavedObject('index-pattern', id, options)
);

Cypress.Commands.add('setAdvancedSetting', (changes) => {
  const url = `${Cypress.config().baseUrl}/api/opensearch-dashboards/settings`;
  cy.log('setAdvancedSetting')
    .request({
      method: 'POST',
      url,
      qs: Cypress.env('SECURITY_ENABLED')
        ? {
            security_tenant: CURRENT_TENANT.defaultTenant,
          }
        : {},
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'osd-xsrf': true,
      },
      body: { changes },
    })
    .then((response) => {
      if (response.body.errors) {
        console.error(response.body.items);
        throw new Error('Setting advanced setting failed');
      }
    });
});

// type: logs, ecommerce, flights
Cypress.Commands.add('loadSampleData', (type) => {
  cy.request({
    method: 'POST',
    headers: { 'osd-xsrf': 'opensearch-dashboards' },
    url: `${BASE_PATH}/api/sample_data/${type}`,
  });
});

Cypress.Commands.add('fleshTenantSettings', () => {
  if (Cypress.env('SECURITY_ENABLED')) {
    // Use xhr request is good enough to flesh tenant
    cy.request({
      url: `${BASE_PATH}/app/home?security_tenant=${CURRENT_TENANT.defaultTenant}`,
      method: 'GET',
      failOnStatusCode: false,
    });
  }
});
