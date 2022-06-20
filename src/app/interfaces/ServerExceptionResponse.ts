export interface ServerExceptionResponse {
  code: string
  exception: string | null
  message: string | null
  status: number
  timestamp: number
}
