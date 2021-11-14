const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

const UsersService = require('../../users/usersService');

module.exports = (app) => {

    app.use(passport.initialize());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        let account = await UsersService.findById(id);

        if (account == null) 
        {
            done(null, false);
        }
        else
        {
            done(null, account);
        }
    });
    
    passport.use(
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async (email, password, done) => {
        let account = await UsersService.findOneByEmail(email);
        console.log(account);
        //Account doesn't exist
        if (account === null) 
        {
          return done(null, false, {message: "This email doesn't exist!"});
        }

        //Check password
        //if (!bcrypt.compareSync(password, account.password))
        if (password === account.passport)
        {
          //Incorrect
         return done(null, false, {message: "Incorrect password!"});
        }
        //Correct

        return done(null, account);
      })
    );

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.JWT_SECRET_KEY
    },
        function (jwtPayload, cb) {
            //find the user in db if needed
            return UsersService.findById(jwtPayload.id)
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ));
};