import _ from 'lodash';

export default function getDataInfo({
  fileds = [],
  object = {},
}: {
  fileds: string[];
  object: Object;
}) {
  return _.pick(object, fileds);
}

export function removeFields({ fields = [], object = {} }: { fields: string[]; object: Object }) {
  return _.omit(object, fields);
}
