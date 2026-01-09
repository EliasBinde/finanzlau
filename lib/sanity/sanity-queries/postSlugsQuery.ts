export const postSlugsQuery = `
*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
} | order(slug asc)
`;