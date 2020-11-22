import request from '@/utils/request'
// import store from '@/store/index'
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}
// 获取验证码
export const onSendSms = mobile => {
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobile}`
    })
}
// 获取用户个人信息
export const loadUserInfo = () => {
    return request({
        method: 'GET',
        url: `/v1_0/user`
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}
// 获取个人频道信息
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: `/v1_0/user/channels`
    })
}
// 关注用户
export const addFollowingsUser = (target) => {
    return request({
        method: 'POST',
        url: `/v1_0/user/followings`,
        data: {
            target
        }
    })
}
// 取消关注用户
export const deleteFollowingsUser = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`
    })
}
// 收藏文章
export const addArticle = (target) => {
    return request({
        method: 'POST',
        url: `/v1_0/article/collections`,
        data: {
            target
        }
    })
}
// 取消收藏文章
export const deleteArticle = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/collections/${target}`
    })
}
// 对文章点赞
export const likeArticle = (target) => {
    return request({
        method: 'POST',
        url: `/v1_0/article/likings`,
        data: {
            target
        }
    })
}
// 取消文章点赞
export const deleteLikeArticle = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/likings/${target}`
    })
}
// 获取用户个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: `/v1_0/user/profile`
    })
}
// 编辑用户个人资料
export const patchUserProfile = data => {
    return request({
        method: 'PATCH',
        url: `/v1_0/user/profile`,
        data
    })
}
// 编辑用户照片资料
export const patchUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: `/v1_0/user/photo`,
        data
    })
}
