module.exports = async (req, res, service) => {
  try {
    const { status, data, error } = await service({
      query: { ...req.query },
      body: { ...req.body },
      params: { ...req.params },
      userId: req.userId,
    });
    return res.status(status).json({ data, error });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
