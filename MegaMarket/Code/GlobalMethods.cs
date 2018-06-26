using System.Web;

namespace MegaMarket.Code
{
    public class GlobalMethods
    {
        public static bool IsAuthenticated
        {
            get { return HttpContext.Current.User.Identity.IsAuthenticated; }
        }
    }
}