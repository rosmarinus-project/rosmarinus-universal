import { v4 } from 'uuid';
import now from 'performance-now';

/**
 * 获取随机生成的唯一 ID
 */
export function uuid(): string {
  return v4();
}

/**
 * 获取当前时间戳
 */
export function uuidInTime(): string {
  return String(now());
}

/**
 * 获取带时间戳的唯一 ID
 */
export function uuidWithTime(): string {
  return `${uuidInTime()}-${uuid()}`;
}
