 type ApiResponse<T = any> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
};

 type PaginatedDataResultResponse<T = any> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemPerPages: number;
    totalPages: number;
    currentPage: number;
  };
};
