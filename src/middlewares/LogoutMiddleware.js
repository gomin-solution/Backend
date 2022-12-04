module.exports = (bye, req, res, next) => {
  try {
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
    console.log("///////////bye//////////////");
    console.log(bye);
    if (bye) {
      return res.status(200).json({ message: "탈퇴 처리 되었습니다" });
    } else {
      return res.status(200).json({ message: "로그아웃 되었습니다" });
    }
  } catch (error) {
    console.trace(error);
    return res.status(400).send({
      errorMessage: "잘못된 접근입니다.",
    });
  }
};
