
// admin middleware to handle the sessions 

const  adminLoggedIn= async (req, res, next) => {
    if (req.session.isAdminAuth) {
      next();
    } else {
      res.redirect("/");
    }
  };
  
  const adminNotLoggedIn = async (req, res, next) => {
    if (!req.session.isAdminAuth) {
      next();
    } else {
      res.redirect("/admin");
    }
  };
  
// exporting the modules 
  module.exports = {
    adminNotLoggedIn,
    adminLoggedIn,
  };
  