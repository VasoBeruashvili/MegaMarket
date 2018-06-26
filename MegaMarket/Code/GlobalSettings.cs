using System;
using System.Configuration;

namespace MegaMarket.Code
{
    public static class GlobalSettings
    {
        public static int CookieLifeDays { get { return Convert.ToInt32(ConfigurationManager.AppSettings.Get("CookieLifeDays")); } }

        public static string ContactPhoneNumber { get { return ConfigurationManager.AppSettings.Get("ContactPhoneNumber").ToString(); } }

        public static string ContactPhoneNumber2 { get { return ConfigurationManager.AppSettings.Get("ContactPhoneNumber2").ToString(); } }
    }
}