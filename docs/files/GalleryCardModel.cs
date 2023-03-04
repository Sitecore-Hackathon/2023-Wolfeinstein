using Constellation.Foundation.ModelMapping.FieldModels;
using Constellation.Foundation.ModelMapping.MappingAttributes;
using System.Web;

namespace Feature.Content.Models
{
    public class GalleryCardModel
    {
        public ImageModel CardImage { get; set; }
        [RawValueOnly]
        public string VideoId { get; set; }
        public HtmlString CardCaption { get; set; }

        public bool IsImageCard()
        {
            return string.IsNullOrEmpty(VideoId) && !string.IsNullOrEmpty(CardImage?.Src);
        }

        public bool IsVideoCard()
        {
            return !string.IsNullOrEmpty(VideoId) && CardImage == null;
        }
    }
}
