/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable spaced-comment */

declare module 'zalgo-captcha' {
  export const create: () => [string, string]
}

declare module '@polka/send-type' {
  /// <reference types="node"/>
  import { ServerResponse } from 'http'
  export default function (res: ServerResponse, status: number, payload: Record<string, string>): void
}
