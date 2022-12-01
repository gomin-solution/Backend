module.exports = (req, res, next) => {
  try {
    const { accesstoken, refreshtoken } = req.cookies;
    console.log("accesstoken", accesstoken);
    console.log("refreshtoken", refreshtoken);

    res.cookie("accesstoken", "expire", {
      maxAge: 0,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.cookie("refreshtoken", "expire", {
      maxAge: 0,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    return res.status(200).json({ message: "로그아웃 되었습니다" });
  } catch (error) {
    console.trace(error);
    return res.status(400).send({
      errorMessage: "잘못된 접근입니다.",
    });
  }
};
