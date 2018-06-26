using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MegaMarket.Code;
using MegaMarket.Utils;
using MegaMarket.ViewModels;

namespace MegaMarket.Controllers
{
    public class HomeController : BaseController
    {
        MMLogic _businesslogic;

        public MMLogic BusinessLogic
        {
            get
            {
                return _businesslogic ?? (_businesslogic = new MMLogic());
            }
        }

        public ActionResult Index()
        {
            using (var context = new MMContext())
            {
                var categories = BusinessLogic.GetCategories(null, 1).Select(k => new CategoryModel()
                {
                    Id = k.Id,
                    Name = k.Name,
                    IconName = k.IconName
                }).ToList();


                foreach (var cat in categories)
                {
                    cat.SubCategories = BusinessLogic.GetCategories(null, cat.Id)
                                                               .Select(k => new CategoryModel()
                                                               {
                                                                   Id = k.Id,
                                                                   Name = k.Name
                                                               }).ToList();
                }

                ViewBag.Categories = categories;
            }

            return View();
        }
    }
}