using System;
using System.Web;
using System.Web.Mvc;

namespace MegaMarket.Filters
{
    public class ValidateOfficeUserFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session["Admin"] == null)
            {
                if (!filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    //filterContext.Result = new RedirectResult("/Admin/Auth/Login");
                    var urlHelper = new UrlHelper(HttpContext.Current.Request.RequestContext);
                    filterContext.Result = new RedirectResult(urlHelper.Action("Login", "Auth", new { Area = "Admin" }));
                }
                else
                {

                }
            }
        }
    }

    public class NoCacheAttribute : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            filterContext.HttpContext.Response.Cache.SetExpires(DateTime.UtcNow.AddDays(-1));
            filterContext.HttpContext.Response.Cache.SetValidUntilExpires(false);
            filterContext.HttpContext.Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
            filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            filterContext.HttpContext.Response.Cache.SetNoStore();

            base.OnResultExecuting(filterContext);
        }
    }
}