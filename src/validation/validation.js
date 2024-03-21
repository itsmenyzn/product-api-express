import { ResponseError } from "../error/response-error.js";

const validate = (schema, request, message = "") => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    if (message == "") {
      throw new ResponseError(400, result.error.message);
    }
    throw new ResponseError(400, message);
  } else {
    return result.value;
  }
};

export { validate };
