import request from '@/utils/request'
// 获取文章列表
export const getArticles = (params) => {
    return request({
        method: 'GET',
        url: '/v1_1/articles',
        params
    })
}
// 获取文章详情
export const getArticlesById = (articleId) => {
    return request({
        method: 'GET',
        url: `/v1_0/articles/${articleId}`
    })
}
