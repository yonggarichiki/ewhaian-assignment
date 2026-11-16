const notFound = (req, res) => {
  res.status(404).json({ message: 'Not found' });
};

const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON' });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};

module.exports = {
  notFound,
  errorHandler,
};
