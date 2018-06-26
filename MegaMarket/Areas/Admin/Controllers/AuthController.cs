using MegaMarket.Filters;
using MegaMarket.Models;
using System.Web.Mvc;
using System.Web.Security;

namespace MegaMarket.Areas.Admin.Controllers
{
    public class AuthController : Controller
    {
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login()
        {
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(User model)
        {
            if (ModelState.IsValid)
            {
                MyMembershipProvider myMembershipProvider = new MyMembershipProvider();
                if (myMembershipProvider.ValidateUser(model.UserName, model.Password))
                {
                    //return Redirect("/Admin/Office/PriceTypes");
                    return RedirectToAction("PriceTypes", "Office", new { Area = "Admin" });
                }
                else
                {
                    ViewBag.Error = "სახელი ან პაროლი არასწორია!";
                    return View(new User());
                }
            }
            else
            {
                ViewBag.Error = "სახელი და პაროლი აუცილებელია!";
                return View(new User());
            }            
        }

        //
        

        public ActionResult Logout()
        {
            Session.Remove("Admin");
            return RedirectToAction("Login", "Auth", new { Area = "Admin" });
        }
    }
}