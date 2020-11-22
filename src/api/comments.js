import request from '@/utils/request'
// 获取评论列表
export const getComments = params => {
    return request({
        method: 'GET',
        url: `/v1_0/comments`,
        params
    })
}
// GET参数使用params进行传递
// 我们写的时候是对象，但是最终发给后端的数据是？
// axios会把params对象转为key=value?key=value的格式url中
// 评论点赞
export const addCommentsLike = target => {
    return request({
        method: 'POST',
        url: `/v1_0/comment/likings`,
        data: {
            target
        }
    })
}
// 取消评论点赞
export const deleteCommentsLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`
    })
}
// 发布评论
export const addComments = data => {
    return request({
        method: 'POST',
        url: `/v1_0/comments`,
        data
    })
}
