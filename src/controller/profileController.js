const { validateEditProfileData } = require("../utils/validation");

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`profile api Error: ${error.message}`);
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      // return res.status(400).send("")
      throw new Error("Invalid edit Request");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();

    res.json({
      message: `${user.firstName}, Profile update successfully!!`,
      data: user,
    });
  } catch (error) {
    res.status(400).send(`profileUpdate api Error: ${error.message}`);
  }
};

module.exports = { getUserProfile, updateProfile };
