export const postsListQuery = `
*[_type == "post" && defined(slug.current)]
| order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  "slug": slug.current,
  publishedAt,

  "title": coalesce(
    title[_key == $lang][0].value,
    title[_key == "de"][0].value
  ),

  // optional: hero preview for cards
  hero{
    kind,
    image{
      asset->{ url },
      alt
    },
    youtube{ url }
  }
}
`;