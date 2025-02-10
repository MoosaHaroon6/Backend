import jwt from 'jsonwebtoken';

const { SECRET_TOKEN } = process.env;

// middleware for authentication 
const isLoggedIn = (req, res, next) => {
    // check if token is in the headers
    if (req.cookies.token === '') {
        return res.status(401).json({ message: 'Logged In First' });
    } else {
        const verficationToken = jwt.verify(req.cookies.token, SECRET_TOKEN);
        req.user = verficationToken;
        console.log(req.user);
        next();
    }
}

export default isLoggedIn;