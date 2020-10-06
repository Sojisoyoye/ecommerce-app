import User from '../models/user';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../helpers/dbErrorHandler';
import expressJwt from 'express-jwt';
import dotenv from 'dotenv';

dotenv.config();

export const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

export const signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                    error: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

export const signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with email not available"
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json(
                    { error: 'Email and password do not match' }
                )
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

        res.cookie('token', token, {expire: new Date() + 9999});

        const {_id, name, email, role} = user;

        return res.json(
                { token, user: { _id, name, email, role} }
            )

    });
};

export const signout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Signout successful'})
};
