const COOKIE_MAP = {
  Student: "studentToken",
  Company: "companyToken",
  TPO: "tpoToken",
};

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = COOKIE_MAP[user.role] || "token";
  const expireDays = parseInt(process.env.COOKIE_EXPIRE) || 7;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
