using System.Collections.Generic;
using System.Linq;
using MegaMarket.Models;

namespace MegaMarket.Utils
{
    public class MMLogic
    {
        public List<GroupCategory> GetCategories(int? id, int? parentID)
        {
            using (var context = new MMContext())
            {
                return context.GroupCategories.Where(x => (id.HasValue && x.Id == id) 
                                                       || (parentID.HasValue && x.ParentId == parentID)
                                                       || (!id.HasValue && !parentID.HasValue))
                                                       .OrderBy(o => o.OrderBy)
                                                       .ToList();
            }
        }
    }
}