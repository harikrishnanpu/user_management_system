// userAuth.js
function checkIsUserLoggedIn (req, res, next)  {
    if (req.session.user) next();
    else res.redirect('/login');
  };
  
  function redirectIfUserLoggedIn (req, res, next)  {
    if (req.session.user) res.redirect('/');
    else next();
  };


  function checkIsAdminLoggedIn (req,res,next)  {
    if( req.session.admin ) next();
    else res.redirect('/admin/login')
  }

  function redirectIfAdminLoggedIn (req,res,next) {
    if (req.session.admin) res.redirect('/admin/dashboard');
    else next();
  }
  
  module.exports = { checkIsUserLoggedIn, redirectIfUserLoggedIn, checkIsAdminLoggedIn, redirectIfAdminLoggedIn };
  