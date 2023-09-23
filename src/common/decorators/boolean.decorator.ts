import { Transform } from 'class-transformer';

const convertToBoolean = (value: any) => {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'boolean') return value;

  if (['true', 'on', 'yes', '1', 'y'].includes((value as string).toLowerCase())) return true;

  if (['false', 'off', 'no', '0', 'n'].includes((value as string).toLowerCase())) return false;

  return undefined;
};

export const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );

  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return convertToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};
