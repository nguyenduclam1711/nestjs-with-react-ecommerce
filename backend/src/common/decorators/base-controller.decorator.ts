import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import {
  IdParamNames,
  MODEL_DEFAULT_ID_PARAM_NAMES,
} from 'src/constants/model';

export function ApiIdParamNameQueries(
  idParamNames: IdParamNames = MODEL_DEFAULT_ID_PARAM_NAMES,
) {
  const decorators = idParamNames.map((idParam) =>
    ApiQuery({ name: idParam.name, required: true, type: idParam.type }),
  );
  return applyDecorators(...decorators);
}
