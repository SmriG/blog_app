import { gql, request } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async () => {
    const query = gql`
        query GET_POSTS{
            postsConnection {
                edges {
                  node {
                    author {
                      id
                      name
                      bio
                      photo {
                        url
                      }
                    }
                    createdAt
                    excerpt
                    slug
                    title
                    id
                    featuredImage {
                        url
                    }
                    categories {
                        name
                        slug
                      }
                  }
                }
              }
        }
    `
    const result = await request(graphqlAPI, query);
    return result.postsConnection.edges;
};

export const getPostDetails = async (slug) => {
    const query = gql`
        query GET_POST_DETAILS($slug:String!){
            post(where:{slug:$slug})
            {
                author {
                    id
                    name
                    bio
                    photo {
                    url
                    }
                }
                createdAt
                excerpt
                slug
                title
                id
                featuredImage {
                    url
                }
                content{
                    raw
                }
                categories {
                    name
                    slug
                  }
            }
        }
    `
    const result = await request(graphqlAPI, query, {slug});
    return result.post;
};


export const getRecentPosts = async () => {
    const query = gql`
        query GET_POST_DETAILS(){
            posts(
                orderBy: createdAt_ASC
                last:3
             ){
                 title
                 featuredImage{
                     url
                 }
                 createdAt
                 slug
             }

        }
    `
    const result = await request(graphqlAPI, query);
    return result.posts;

};

export const getSimilarPosts = async (categories, slug) => {
    const query = gql`
        query GET_SIMILAR_POSTS($slug: String!, $categories: [String!]){
            posts(
                where:{
                    slug_not: $slug,
                    AND:{ categories_some: {slug_in: $categories } }
                }
                last : 3
            ){
                title
                featuredImage{
                    url
                }
                createdAt
                slug
            }
        }
    `
    const result = await request(graphqlAPI, query, {categories, slug});
    return result.posts;

};

export const getCategories = async () => {
    const query = gql`
        query GET_CATEGORIES{
            categories{
                name
                slug
            }
        }
    `
    const result = await request(graphqlAPI, query);
    return result.categories;

};

export const submitComment = async ( obj ) =>{
    const result = await fetch('/api/comments', {
        method: "POST",
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(obj),
    })
    return result.json()
}