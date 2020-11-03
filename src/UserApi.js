export const USER_API_URL = 'http://localhost:3005/api'

export const USER_CREATE = (fromData) => {
    return {
        url: USER_API_URL + '/user/register',
        options: {
            method: 'POST',
            body: fromData
        }
    }
} 

export const USER_LOGIN = (body) => {
    return {
        url: USER_API_URL + '/user/login',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
    }
}

export const USER_UPDATEIMG = (formData, token) => {
    return {
        url: USER_API_URL + '/user/update',
        options: {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: formData
        }
    }
}

export const USER_UPDATEDB = (body, token) => {
    return {
        url: USER_API_URL + '/moviedb/update',
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify(body)
        }
    }
}