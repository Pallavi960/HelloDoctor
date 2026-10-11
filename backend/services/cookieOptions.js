const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    path: "/"
};
