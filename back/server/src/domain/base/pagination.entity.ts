/* eslint-disable max-classes-per-file */
import { Expose as JsonProperty } from 'class-transformer';
import { ParsedQs } from 'qs';
import { BaseEntity } from './base.entity';

export type PaginationQueryType = string | ParsedQs | (string | ParsedQs)[];

export class PageRequest {
  @JsonProperty()
  page = 0;
  @JsonProperty()
  size = 20;

  constructor(page: number | PaginationQueryType, size: number | PaginationQueryType) {
    this.page = PageRequest.handleNumberTypes(page, this.page);
    this.size = PageRequest.handleNumberTypes(size, this.size);
  }

  public static handleNumberTypes(pp: number | PaginationQueryType, fallback: number): number {
    if (typeof pp === 'number') {
      return pp;
    }
    const query = PageRequest.handleQueryType(pp);
    if (query) {
      const parsed = parseInt(query, 10);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }

  public static handleQueryType(pa: PaginationQueryType): string | undefined {
    pa = Array.isArray(pa) ? pa[0] : pa;
    if (typeof pa === 'string') {
      return pa;
    }
    return undefined;
  }
}

export class Page<T extends BaseEntity> {
  constructor(
    public content: T[],
    public total: number,
    public pageable: PageRequest,
  ) {}
}
