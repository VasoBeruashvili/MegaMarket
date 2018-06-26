using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MegaMarket.Startup))]
namespace MegaMarket
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
