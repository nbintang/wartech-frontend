type ApiResponse<T = any> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
};

type PaginatedApiResponse<T = any> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemPerPages: number;
    totalPages: number;
    currentPage: number;
  };
};
