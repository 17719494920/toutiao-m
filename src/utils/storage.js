// 封装本地存储操作模块
export const setItem = (key, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}
export const getItem = (key) => {
    const data = window.localStorage.getItem(key)
    // 用try,catch方法,如果能成功解析,就返回解析后的data,如果不能成功解析,就直接返回data
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}
export const removItem = (key) => {
    window.localStorage.removeItem(key)
}
