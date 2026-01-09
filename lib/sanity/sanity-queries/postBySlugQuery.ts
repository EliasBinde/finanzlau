export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  publishedAt,

  // localized title: pick current lang else fallback de
  "title": coalesce(
    title[_key == $lang][0].value,
    title[_key == "de"][0].value
  ),

  // localized body portable text (array of blocks)
  "body": coalesce(
    body[_key == $lang][0].value,
    body[_key == "de"][0].value
  ),

  hero{
    kind,
    caption,
    image{
      asset->{
        url,
        metadata { dimensions }
      },
      alt
    },
    youtube{
      url,
      title
    }
  },

  gallery[]{
    _type,
    // image
    _type == "image" => {
      _type,
      asset->{
        url,
        metadata { dimensions }
      },
      alt
    },
    // youtube object
    _type == "youtube" => {
      _type,
      url,
      title
    }
  }
}
`;