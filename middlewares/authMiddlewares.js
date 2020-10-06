export const isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    
    if (!user) {
        return res.status(403).json({
            error: "Access denied"
        })
    };
    next();
};


export const isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json(
            { error: 'Admistrator access denied' }
            );
        };
    next();
};
