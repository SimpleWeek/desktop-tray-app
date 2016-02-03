import _ from 'lodash';
import urlJoin from 'url-join';
import queryString from 'query-string';
import { BACKEND_BASE_URL } from '../config';

function createError(data, status, statusText) {
  let error;
  if (data.error && data.error.message) {
    error = Error(data.error.message);
    _.assign(error, _.omit(data.error, 'message'));
  } else {
    error = Error(statusText);
  }
  error.statusCode = status;
  return error;
}

function parseResponse(response) {
  return response.json()
    .catch(() => { throw Error(`Unknown error: ${ response.statusText }`); })
    .then((data) => {
      if (!response.ok) {
        throw createError(data, response.status, response.statusText);
      }
      return data;
    });
}

function buildHeaders(contentType = null, accessToken = null) {
  const headers = { Accept: 'application/json' };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${ accessToken }`;
  }

  return headers;
}

function sendRequest(url, type, rawData, accessToken = null) {
  const contentType = (rawData instanceof FormData) ? null : 'application/json';
  return fetch(urlJoin(BACKEND_BASE_URL, url), {
    method: type,
    headers: buildHeaders(contentType, accessToken),
    body: rawData
  }).then(parseResponse);
}

export function doGet(url, params, accessToken = null) {
  const query = queryString.stringify(params);
  return fetch(urlJoin(BACKEND_BASE_URL, url, `?${query}`), {
    method: 'get',
    headers: buildHeaders('application/json', accessToken),
  }).then(parseResponse);
}

export function doPost(url, data, accessToken = null) {
  return sendRequest(url, 'post', JSON.stringify(data), accessToken);
}

export function doPut(url, data, accessToken = null) {
  return sendRequest(url, 'put', JSON.stringify(data), accessToken);
}
