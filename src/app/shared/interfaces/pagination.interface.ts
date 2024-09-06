export interface Pagination {
    currentPage: number
    size: number;
    totalElements: number
    totalPages: number;
    items: Item[];
}

export interface Item {
    index: number;
    name: string;
}