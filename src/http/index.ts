import MetaData from '../core';

const getContructor: Function = (target: object) => (
  target instanceof Function ? target : target.constructor);

const methodDecorators = ({ url, method }) => (target: any,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
  const constructor = getContructor(target);
  const methodMateData = MetaData.getMethodMateData(constructor, propertyName);
  methodMateData.method = method;
  methodMateData.url = url;
  MetaData.methods.set(MetaData.getMethodKey(constructor, propertyName), methodMateData);
  return propertyDescriptor;
};

const ParamsDecorators = (key, mapKey) => (target: object,
  propertyName: string,
  index: number): void => {
  const constructor = getContructor(target);
  const methodMetaData = MetaData.getMethodMateData(constructor, propertyName);
  if (!methodMetaData[mapKey]) {
    methodMetaData[mapKey] = new Map<string, number>();
  }
  methodMetaData[mapKey].set(key, index);
};
export const GET = (url) => methodDecorators({ url, method: 'GET' });

export const POST = (url) => methodDecorators({ url, method: 'POST' });

export const Del = (url) => methodDecorators({ url, method: 'DELETE' });

export const Head = (url) => methodDecorators({ url, method: 'HEAD' });

export const Patch = (url) => methodDecorators({ url, method: 'PATCH' });


export const BaseUrl = (url) => (target: any): void => {
  const constructor = getContructor(target);
  if (!MetaData.targetConfig.has(constructor)) {
    MetaData.targetConfig.set(constructor, Object.create(null));
  }
  const classConfig = MetaData.targetConfig.get(constructor);
  classConfig.baseUrl = url;
};

export const Path = (key): Function => ParamsDecorators(key, 'pathParams');

export const Header = (key): Function => ParamsDecorators(key, 'headerParams');

export const Query = (key): Function => ParamsDecorators(key, 'queryParams');

export const Body = (key): Function => ParamsDecorators(key, 'bodyParams');


export const Headers = (headers: string[]) => (
  target: Function,
): void => {
  const constructor = getContructor(target);
  let classConfig = MetaData.targetConfig.get(constructor);
  if (!classConfig) {
    classConfig = {
      headers: [],
    };
  }
  classConfig.headers = classConfig.headers.concat(headers);
  MetaData.targetConfig.set(constructor, classConfig);
};
