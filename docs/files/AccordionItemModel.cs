using Constellation.Foundation.ModelMapping.MappingAttributes;
using System.Web;

namespace Feature.Content.Models
{
    public class AccordionItemModel
    {
        public HtmlString Title { get; set; }

        public HtmlString Copy { get; set; }

        [RawValueOnly]
        public string Name { get; set; }
    }
}
