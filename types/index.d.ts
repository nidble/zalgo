export interface SuccessPayload extends ResponsePayload {
  type: 'Success'
  data: {
    id: string
    message?: string
    attempts?: number
    base64?: string
  }
}

export interface ErrorPayload extends ResponsePayload {
  type: 'Error'
  errors: Array<{
    message: string
    field?: string
  }>
}

export type ResponsePayload = SuccessPayload | ErrorPayload
