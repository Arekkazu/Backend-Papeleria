export const IndexController = {
  index: (req, res) => {
    res.status(200).json({ message: "Welcome to the API!" });
  },
};
