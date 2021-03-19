/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable spaced-comment */

declare module '@polka/send-type' {
  /// <reference types="node"/>
  import { ServerResponse } from 'http'
  export default function <T>(
    res: ServerResponse,
    status: number,
    payload: Record<string, T>,
    headers?: Record<string, string>,
  ): void
}
