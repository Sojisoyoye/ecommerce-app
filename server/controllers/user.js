import User from '../models/user';

export const userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        req.profile = user;
        next();
    });
};


export const getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.status(200).json(req.profile);
};

export const updateUser = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Not authorized to perform this action'
            })
        }
        
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    })
};
