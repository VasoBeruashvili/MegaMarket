using System.Web.Mvc;

namespace MegaMarket.Code
{
    public class BaseController : Controller
    {
        public bool IsAuthenticated
        {
            get { return GlobalMethods.IsAuthenticated; }
        }

        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            base.OnResultExecuting(filterContext);

            if (IsAuthenticated)
            {
                // TODO: ყოველ Requst ზე რამე ინფორმაციის აღება User იდან
                // Example: ViewBag.UserName = UserManager.User.UserName;
            }
        }
    }
}