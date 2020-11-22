import request from '@/utils/request'
// 获取全部频道
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}
// 添加个人频道，批量修改用户频道列表
export const addUserChannels = (channel) => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}
// 删除指定用户频道
export const deleteUserChannels = (channelId) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${channelId}`
    })
}
// 老一套:
// 1.找到接口,
//     2.封装接口,
//         3.接口调用,
//             4.数据展示
