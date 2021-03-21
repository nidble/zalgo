/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable spaced-comment */

declare module '@polka/send-type' {
  /// <reference types="node"/>
  import { ServerResponse } from 'http'
  import { ResponsePayload } from '..'
  export default function (
    res: ServerResponse,
    status: number,
    payload: ResponsePayload,
    headers?: Record<string, string>,
  ): void
}
