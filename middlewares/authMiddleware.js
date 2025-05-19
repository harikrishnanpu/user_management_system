// userAuth.js
function checkIsUserLoggedIn (req, res, next)  {
    if (req.session.user) return next();
    else return res.redirect('/login');
  };
  
  function redirectIfUserLoggedIn (req, res, next)  {
    if (req.session && req.session.user) return res.redirect('/');
    else return next();
  };


  function checkIsAdminLoggedIn (req,res,next)  {
    if(req.session && req.session.admin ) return next();
    else return res.redirect('/admin/login')
  }

  function redirectIfAdminLoggedIn (req,res,next) {
    if (req.session && req.session.admin) return res.redirect('/admin/dashboard');
    else return next();
  }
  
  module.exports = { checkIsUserLoggedIn, redirectIfUserLoggedIn, checkIsAdminLoggedIn, redirectIfAdminLoggedIn };
  