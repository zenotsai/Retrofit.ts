import { Method } from '../interfaces/index';

function uniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; const
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export interface MethodMeteData {
  url: string;
  method: Method;
  queryParams: Map<string, number>;
  pathParams: Map<string, number>;
  headerParams: Map<string, number>;
  bodyParams: Map<string, number>;
}

export interface ClassMetaData {
  baseUrl?: string;
  headers?: string[];
}
const getClassName = (target: any): string => (typeof target === 'function' ? target.name : target.constructor.name);


export default class MetaData {
  static targetConfig: Map<Function, ClassMetaData> = new Map<Function, ClassMetaData>();

  static targetMapper: Map<Function, string> = new Map<Function, string>();

  static methods: Map<string, MethodMeteData> = new Map<string, MethodMeteData>();

  public static getUniqueId(target: any): string {
    return `${getClassName(target)}_${uniqueId()}`;
  }


  public static getMethodMateData(target: any, method: string): MethodMeteData {
    if (!method) {
      throw new Error('not found method');
    }
    const metaKey = MetaData.getMethodKey(target, method);
    if (!MetaData.methods.has(metaKey)) {
      MetaData.methods.set(metaKey, Object.create(null));
    }
    return MetaData.methods.get(metaKey);
  }

  public static getMethodKey(target: any, method: string): string {
    let targetKey: string = MetaData.targetMapper.get(target);
    if (!targetKey) {
      targetKey = MetaData.getUniqueId(target);
      MetaData.targetMapper.set(target, targetKey);
    }
    return `${targetKey}_${method}`;
  }
}
