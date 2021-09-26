/* global __resourceQuery */
declare var __resourceQuery: string

import querystring from 'querystring'
import SockJS from 'sockjs-client'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import { reportBuildError, dismissBuildError } from 'react-error-overlay'
import { SocketOptions } from '../SocketOptions'

let sockOptions: SocketOptions = {}
if (typeof __resourceQuery === 'string' && __resourceQuery) {
  sockOptions = querystring.parse(__resourceQuery.substr(1))
}

const connection = new SockJS(
  `${window.location.protocol}//${
    sockOptions.sockHost || window.location.hostname
  }:${sockOptions.sockPort || window.location.port}${
    sockOptions.sockPath || '/sockjs-node'
  }`,
)

connection.onmessage = function onmessage(e) {
  const { type, data } = JSON.parse(e.data)
  let formatted
  switch (type) {
    case 'ok':
      dismissBuildError()
      break
    case 'errors':
      formatted = formatWebpackMessages({
        errors: data,
        warnings: [],
      })
      reportBuildError(formatted.errors[0])
      break
    default:
    // Do nothing.
  }
}