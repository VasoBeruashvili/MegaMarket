using MegaMarket.Filters;
using MegaMarket.Models;
using MegaMarket.Utils;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MegaMarket.Areas.Admin.Controllers
{
    [NoCache]
    [ValidateOfficeUserFilter]
    public class OfficeController : BaseController
    {
        #region Views        
        public ActionResult PriceTypes()
        {
            return View();
        }


        public ActionResult Units()
        {
            return View();
        }


        public ActionResult ProductParamTypes()
        {
            return View();
        }


        public ActionResult GroupCategories()
        {
            return View();
        }


        public ActionResult Vendors()
        {
            return View();
        }


        public ActionResult Products()
        {
            return View();
        }


        public ActionResult Manufacturers()
        {
            return View();
        }


        public ActionResult Brands()
        {
            return View();
        }
        #endregion




        #region PriceTypes
        public JsonResult SavePriceType(PriceType priceType)
        {
            if (priceType != null)
            {
                priceType.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (priceType.Id == 0) //add
                    {
                        context.PriceTypes.Add(priceType);
                    }
                    else
                    {
                        if (priceType.Deleted) //delete
                        {
                            context.Entry(priceType).State = EntityState.Deleted;
                            context.PriceTypes.Remove(priceType);
                        }
                        else //edit
                        {
                            context.Entry(priceType).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }
        #endregion



        #region Units
        public JsonResult SaveUnit(Unit unit)
        {
            if (unit != null)
            {
                unit.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (unit.Id == 0) //add
                    {
                        context.Units.Add(unit);
                    }
                    else
                    {
                        if (unit.Deleted) //delete
                        {
                            context.Entry(unit).State = EntityState.Deleted;
                            context.Units.Remove(unit);
                        }
                        else //edit
                        {
                            context.Entry(unit).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }
        #endregion



        #region ProductParamTypes
        public JsonResult SaveProductParamType(ProductParamType productParamType)
        {
            if (productParamType != null)
            {
                productParamType.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    bool dublicated = context.ProductParamTypes.Any(ppt => ppt.Name == productParamType.Name);

                    if (productParamType.Id == 0 && !dublicated) //add
                    {
                        context.ProductParamTypes.Add(productParamType);
                    }
                    else if(productParamType.Id != 0)
                    {
                        if (productParamType.Deleted) //delete
                        {
                            context.Entry(productParamType).State = EntityState.Deleted;
                            context.ProductParamTypes.Remove(productParamType);
                        }
                        else //edit
                        {
                            context.Entry(productParamType).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }


        public JsonResult GetProductParamTypes(int? id)
        {
            using (var context = new MMContext())
            {            
                if(id == null)
                {
                    return Json(context.ProductParamTypes.ToList());
                }
                else
                {
                    var groupParamIds = context.GroupParams.Where(gp => gp.GroupCategoryId == id.Value).Select(gp => gp.ProductParamTypeId);

                    return Json(context.ProductParamTypes.Where(ppt => groupParamIds.Contains(ppt.Id)).ToList());
                }
            }
        }
        #endregion



        #region GroupCategories
        public JsonResult GetGroupCategories()
        {
            using (var context = new MMContext())
            {
                var groupCategories = context.GroupCategories.OrderBy(gc => gc.OrderBy).ToList();
                groupCategories.ForEach(gc =>
                {
                    gc.Expanded = gc.ParentId == 0 || gc.ParentId == 1 ? true : false;
                    gc.IconImage = gc.IconName;
                    gc.IconName = string.Format("../../Content/Resources/Category/{0}", gc.IconName);
                });

                return Json(groupCategories, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult SaveGroupCategory(GroupCategory groupCategory)
        {
            if(groupCategory != null)
            {
                groupCategory.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (groupCategory.Id == 0) //add
                    {
                        context.GroupCategories.Add(groupCategory);
                    }
                    else
                    {
                        if (groupCategory.Deleted) //delete
                        {
                            context.Entry(groupCategory).State = EntityState.Deleted;
                            context.GroupCategories.Remove(groupCategory);
                        }
                        else //edit
                        {
                            context.Entry(groupCategory).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }


        public JsonResult DragDropGroupCategories(GroupCategory selItem, GroupCategory prevOrNextItem)
        {            
            return Json(new { selSave = SaveGroupCategory(selItem), prevOrNextItemSave = SaveGroupCategory(prevOrNextItem) });
        }


        public JsonResult SaveGroupParam(GroupParam groupParam)
        {
            int userId = (Session["Admin"] as User).Id;

            using (var context = new MMContext())
            {
                var groupParamEntity = context.GroupParams.FirstOrDefault(gp => gp.GroupCategoryId == groupParam.GroupCategoryId && gp.ProductParamTypeId == groupParam.ProductParamTypeId);                

                groupParam.UserId = userId;                

                if (groupParamEntity == null) //add
                {
                    context.GroupParams.Add(groupParam);
                }
                else
                {
                    groupParamEntity.UserId = userId;

                    if (groupParam.Deleted) //delete
                    {
                        context.Entry(groupParamEntity).State = EntityState.Deleted;
                        context.GroupParams.Remove(groupParamEntity);
                    }
                    else //edit
                    {
                        context.Entry(groupParamEntity).State = EntityState.Modified;
                    }
                }

                return Json(context.SaveChanges() >= 0);
            }
        }

        
        [HttpPost]
        public JsonResult UploadGroupCategoryIcon()
        {
            if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var file = System.Web.HttpContext.Current.Request.Files["GroupCategoryIcon"];

                string pic = Path.GetFileName(file.FileName);
                string path = Path.Combine(
                Server.MapPath("~/Content/Resources/Category"), pic);
                file.SaveAs(path);

                return Json(pic);
            }
            else
            {
                return Json(null);
            }
        }
        #endregion



        #region Vendors
        public JsonResult SaveVendor(Vendor vendor)
        {
            if (vendor != null)
            {
                vendor.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (vendor.Id == 0) //add
                    {
                        context.Vendors.Add(vendor);
                    }
                    else
                    {
                        if (vendor.Deleted) //delete
                        {
                            context.Entry(vendor).State = EntityState.Deleted;
                            context.Vendors.Remove(vendor);
                        }
                        else //edit
                        {
                            context.Entry(vendor).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }
        #endregion



        #region Products
        public JsonResult GetProductsByGroupCategoryId(int id)
        {
            using (var context = new MMContext())
            {
                var products = context.Products.Where(p => p.GroupCategoryId == id).ToList();
                products.ForEach(p =>
                {
                    p.Country = context.Countries.FirstOrDefault(c => c.Id == p.CountryId);
                    p.Manufacturer = context.Manufacturers.FirstOrDefault(m => m.Id == p.ManufacturerId);
                    p.Brand = context.Brands.FirstOrDefault(b => b.Id == p.BrandId);
                });

                return Json(products);
            }
        }


        public JsonResult SaveProduct(Product product)
        {
            if (product != null)
            {
                product.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (product.Id == 0) //add
                    {
                        context.Products.Add(product);
                        context.SaveChanges();

                        if (product.ProductImages != null)
                        {
                            foreach (var productImage in product.ProductImages)
                            {
                                productImage.ProductId = product.Id;
                                SaveProductImage(productImage);
                            }
                        }                                            
                    }
                    else
                    {
                        if (product.Deleted) //delete
                        {
                            if (product.ProductImages != null)
                            {
                                foreach (var productImage in product.ProductImages)
                                {
                                    productImage.Deleted = true;
                                    SaveProductImage(productImage);
                                }
                            }

                            context.Entry(product).State = EntityState.Deleted;
                            context.Products.Remove(product);
                        }
                        else //edit
                        {
                            if(product.ProductImages != null)
                            {
                                foreach (var productImage in product.ProductImages)
                                {
                                    SaveProductImage(productImage);
                                }
                            }

                            context.Entry(product).State = EntityState.Modified;
                        }
                    }                                

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }


        public void SaveProductImage(ProductImage productImage)
        {
            if (productImage != null)
            {
                using (var context = new MMContext())
                {
                    if (productImage.Id == 0) //add
                    {
                        context.ProductImages.Add(productImage);
                    }
                    else
                    {
                        if (productImage.Deleted) //delete
                        {
                            context.Entry(productImage).State = EntityState.Deleted;
                            context.ProductImages.Remove(productImage);
                        }
                        else //edit
                        {
                            context.Entry(productImage).State = EntityState.Modified;
                        }
                    }

                    context.SaveChanges();
                }
            }
        }


        //save small images
        [HttpPost]
        public JsonResult SaveSmallProductImages()
        {
            if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var file = System.Web.HttpContext.Current.Request.Files["SmallImage"];

                string pic = Path.GetFileName(file.FileName);
                string path = Path.Combine(
                Server.MapPath("~/Content/Resources/Products/Small"), pic);
                file.SaveAs(path);

                return Json(pic);
            }
            else
            {
                return Json(null);
            }
        }
        //---


        //save large images
        [HttpPost]
        public JsonResult SaveLargeProductImages()
        {
            if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var files = System.Web.HttpContext.Current.Request.Files;
                List<string> imageNames = new List<string>();

                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    string pic = Path.GetFileName(file.FileName);
                    string path = Path.Combine(
                    Server.MapPath("~/Content/Resources/Products/Large"), pic);
                    file.SaveAs(path);

                    imageNames.Add(pic);
                }

                return Json(imageNames);
            }
            else
            {
                return Json(null);
            }
        }
        //---


        public JsonResult GetProductImagesByProductId(int id)
        {
            using (var context = new MMContext())
            {
                var productImages = context.ProductImages.Where(pi => pi.ProductId == id).ToList();
                var smallImage = context.Products.FirstOrDefault(p => p.Id == id).ImageSmall;
                var largeImages = productImages.Select(pi => pi.ImageLarge).ToList();

                return Json(new { productImages = productImages, smallImage = smallImage, largeImages = largeImages });
            }
        }


        public JsonResult DeleteSmallImage(int productId)
        {
            using (var context = new MMContext())
            {
                var product = context.Products.FirstOrDefault(p => p.Id == productId);

                if(product != null)
                {
                    product.ImageSmall = string.Empty;
                    context.Entry(product).State = EntityState.Modified;
                }

                return Json(context.SaveChanges() >= 0);
            }
        }


        public JsonResult DeleteLargeImage(string largeImageName, int productId)
        {
            using (var context = new MMContext())
            {
                var productImage = context.ProductImages.FirstOrDefault(pi => pi.ImageLarge == largeImageName && pi.ProductId == productId);

                if (productImage != null)
                {
                    context.Entry(productImage).State = EntityState.Deleted;
                    context.ProductImages.Remove(productImage);
                }

                return Json(context.SaveChanges() >= 0);
            }
        }
        #endregion



        #region Countries, Manufacturers, Brands
        public JsonResult GetCountriesManufacturersBrands()
        {
            using (var context = new MMContext())
            {
                return Json(new { countries = context.Countries.ToList(), manufacturers = context.Manufacturers.ToList(), brands = context.Brands.ToList() });
            }
        }


        public JsonResult SaveManufacturer(Manufacturer manufacturer)
        {
            if (manufacturer != null)
            {
                manufacturer.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (manufacturer.Id == 0) //add
                    {
                        context.Manufacturers.Add(manufacturer);
                    }
                    else
                    {
                        if (manufacturer.Deleted) //delete
                        {
                            context.Entry(manufacturer).State = EntityState.Deleted;
                            context.Manufacturers.Remove(manufacturer);
                        }
                        else //edit
                        {
                            context.Entry(manufacturer).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }
                

        public JsonResult SaveBrand(Brand brand)
        {
            if (brand != null)
            {
                brand.UserId = (Session["Admin"] as User).Id;

                using (var context = new MMContext())
                {
                    if (brand.Id == 0) //add
                    {
                        context.Brands.Add(brand);
                    }
                    else
                    {
                        if (brand.Deleted) //delete
                        {
                            context.Entry(brand).State = EntityState.Deleted;
                            context.Brands.Remove(brand);
                        }
                        else //edit
                        {
                            context.Entry(brand).State = EntityState.Modified;
                        }
                    }

                    return Json(context.SaveChanges() >= 0);
                }
            }
            else
            {
                return null;
            }
        }
        #endregion
    }
}