const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
};
