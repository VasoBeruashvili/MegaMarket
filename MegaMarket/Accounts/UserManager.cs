using System;
using System.Web;
using System.Web.Security;
using System.Web.Script.Serialization;
using MegaMarket.Models;
//using MegaMarket.ViewModels;
using MegaMarket.Code;

namespace MegaMarket.Accounts
{
    public static class UserManager
    {
        public static User User
        {
            get
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    return ((MyPrincipal)(HttpContext.Current.User)).User;
                }
                else if (HttpContext.Current.Items.Contains("User"))
                {
                    return (User)HttpContext.Current.Items["User"];
                }
                else
                {
                    return null;
                }
            }
        }

        public static User AuthenticateUser(string username, string password)
        {
            // TODO: ავტორიზაცია

            return new User();
        }

        public static bool ValidateUser(LoginViewModel login, HttpResponseBase response)
        {
            var result = false;

            if (Membership.ValidateUser(login.UserName, login.Password))
            {
                var serializer = new JavaScriptSerializer();
                string userData = serializer.Serialize(User);

                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1,
                        login.UserName,
                        DateTime.Now,
                        DateTime.Now.AddDays(GlobalSettings.CookieLifeDays),
                        true,
                        userData,
                        FormsAuthentication.FormsCookiePath
                    );

                string encTicket = FormsAuthentication.Encrypt(ticket);

                response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));

                result = true;
            }

            return result;
        }

        public static void LogOff(HttpSessionStateBase session, HttpResponseBase response)
        {
            session.Abandon();

            FormsAuthentication.SignOut();

            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, "");
            cookie.Expires = DateTime.Now.AddDays(-1);
            response.Cookies.Add(cookie);
        }
    }
}