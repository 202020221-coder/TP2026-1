export type APIResponse<T> =
  | {
      ok: true;
      data: T;
      error: null;
    }
  | {
      ok: false;
      data: null;
      error: APIError;
    };

export interface APIError {
  code: string;
  message: string;
  details: ErrorDetails;
}

export interface ErrorDetails {
  validation_errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

export interface Pagination<T> {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
