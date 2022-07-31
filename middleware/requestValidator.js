exports.validator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).json({ status: false, message: error.details[0].message });
  } else {
    next();
  }
};

exports.headerValidator = (schema) => (req, res, next) => {
  console.log(req.headers);
  const { error } = schema.validate(req.headers);
  if (error) {
    res.status(422).json({ status: false, message: error.details[0].message });
  } else {
    next();
  }
};

exports.paramsValidator = (schema) => (req, res, next) => {
  console.log(req.params);
  const { error } = schema.validate(req.params);
  if (error) {
    res.status(422).json({ status: false, message: error.details[0].message });
  } else {
    next();
  }
};
