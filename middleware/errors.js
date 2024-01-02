const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Page Not Found' });
};

const errorStatus = (err, req, res, next) => {
  res.status(err.status).json({ success: false, message: err.message });
};

export { notFound, errorStatus };
