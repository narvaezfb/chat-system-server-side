const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

//function that signs a new token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    //create a new token by calling the function
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "succces",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

exports.login = async (req, res, next) => {
  //get the email and password from the request body
  const { email, password } = req.body;

  //check if email and password exists
  if (!email || !password) {
    return next("please provide email or password ");
  }

  //check if user exists and password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.send({ status: "failed" });
    return next("Incorrect email or password");
  }

  //if everything is okay send token to client
  const token = signToken(user._id);
  req.session.user = user;
  console.log(req.session.user);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.checkUserLogin = (req, res, next) => {
  if (req.session.user) {
    res.status(200).json({
      loggedIn: true,
      user: req.session.user,
    });
  } else {
    res.status(200).json({
      loggedIn: false,
    });
  }
};
