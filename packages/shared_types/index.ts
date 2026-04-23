/**
 * Shared TypeScript types for the PS system
 */

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export type LocaleCode = 'zh-CN' | 'en-US' | 'ko-KR';
