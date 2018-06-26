using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMarket.ViewModels
{
    public class CategoryModel
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public int OrderBy { get; set; }
       
        public int UserId { get; set; }
        
        public int ParentId { get; set; }
     
        public int? MainGroupId { get; set; }
       
        public string Path { get; set; }
     
        public string IconName { get; set; }
      
        public bool Expanded { get; set; }
       
        public bool Deleted { get; set; }

        public List<CategoryModel> SubCategories { get; set; }
    }
}