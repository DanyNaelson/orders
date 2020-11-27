const jwt = require('jsonwebtoken')

//========================================
// Verify token
//========================================
let verifyToken = ( req, res, next ) => {
    let token = req.get('Authorization')

    jwt.verify( token, process.env.PRIVATE_KEY, (err, decoded) => {
        if(err){
            if(err.name === "TokenExpiredError"){
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'expired_token'
                    }
                })
            }

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'not_authorized'
                }
            })
        }

        if(req.body.hasOwnProperty('ownerId')) {
            if(decoded.user._id !== req.body.ownerId){
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'not_authorized'
                    }
                })
            }
        }

        if(req.params.hasOwnProperty('ownerId')) {
            if(decoded.user._id !== req.params.ownerId){
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'not_authorized'
                    }
                })
            }
        }

        req.user = decoded.user
        next()
    })
}

//========================================
// Verify role
//========================================
let verifyRole = ( req, res, next ) => {
    let user = req.user

    if (user.role === 'ADMIN_ROLE'){
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'role_not_authorized'
            }
        })
    }
}

module.exports = {
    verifyRole,
    verifyToken
}