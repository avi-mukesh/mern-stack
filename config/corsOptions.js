const allowedOrigins = require("./allowedOrigins")
const corsOptions = {
    origin: (origin, callback) => {
        // if origin is allowed or is not specified (e.g requests from POSTman or smth)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}

module.exports = corsOptions
