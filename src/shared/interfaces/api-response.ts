export type APIResponse<T> =
  | T
  | {
      error: APIError;
    };

export interface APIError {
  error: string;
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
