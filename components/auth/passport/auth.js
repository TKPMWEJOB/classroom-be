const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

const UsersService = require('../../users/usersService');
const AdminService = require('../../admin/adminService');

module.exports = (app) => {

    app.use(passport.initialize());

    passport.use(
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async (email, password, done) => {
        let accountEmail = await UsersService.findOneByEmail(email);
        let accountUsername = await UsersService.findOneByUsername(email);
        //console.log(account);
        //Account doesn't exist
        if (accountEmail === null && accountUsername === null)
        {
            if (accountEmail === null) 
            {
            return done(null, false, {message: "This email doesn't exist!"});
            }
            if (accountUsername === null) 
            {
            return done(null, false, {message: "This username doesn't exist!"});
            }
        }
        
        let account;
        if (accountEmail === null) {
            account = accountUsername;
        } else if (accountUsername === null) {
            account = accountEmail;
        }

        //Check password
        //if (password.localeCompare(account.password) !== 0)
        if (!bcrypt.compareSync(password, account.password))
        {
          //Incorrect
         return done(null, false, {message: "Incorrect password!"});
        }
        //Correct

        //Check if account is activated
        if (!account.isActivated)
        {
          return done(null, false, {message: "Your account is not activated yet!"})
        }

        //Check if account is locked by admin
        if (account.isLocked)
        {
          return done(null, false, {message: "Your account has been locked by admin!"})
        }

        
        return done(null, account);
      })
    );

    let cookieExtractor = function(req) {
        let token = null;
        if (req && req.cookies)
        {
            token = req.cookies['token'];
        }
        return token;
    };

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey   : process.env.JWT_SECRET_KEY
    },
        function (jwtPayload, done) {
            //find the user in db if needed
            console.log(jwtPayload);
            done(null, true);
        }
    ));
};


    /*
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
    */