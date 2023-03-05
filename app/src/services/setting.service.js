// create a service to make http POST request with content type of form data
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL

export class SettingService {
    async saveSetting(name, type, file) {
        // create a form data in javascript
        let formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('file', file);

        // create a fetch request with method post and content type of form data
        await fetch(`${BASE_API_URL}/api/settings`, {
            method: 'POST',
            body: formData,
            headers: {
                contentType: 'multipart/form-data'
            }
        }).then(response => response.json()).then((responseBody) => {
            if (responseBody.code === 'SUCCESS') {
                return
            } else {
                throw new Error(responseBody.message)
            }
        })
        .catch(err => {
            console.log(err)
            throw new Error('Something went wrong')
        })
    }

    async updateSetting(name, file) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        await fetch(`${BASE_API_URL}/api/settings`, {
            method: 'PUT',
            body: formData,
            headers: {
                contentType: 'multipart/form-data'
            }
        }).then(response => response.json()).then((responseBody) => {
            if (responseBody.code === 'SUCCESS') {
                return
            } else {
                throw new Error(responseBody.message)
            }
        })
        .catch(err => {
            console.log(err)
            throw new Error('Something went wrong')
        })
    }

    async addTag(name, settings) {
        const body = JSON.stringify({
            name: name,
            versionIds: settings,
        })
        console.log(body)
        await fetch(`${BASE_API_URL}/api/tags`, {
            method: 'POST',
            body,
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json()).then((responseBody) => {
            if (responseBody.code === 'SUCCESS') {
                return
            } else {
                throw new Error(responseBody.message)
            }
        })
        .catch(err => {
            console.log(err)
            throw new Error('Something went wrong')
        })
    }

    async getSettings() {
        return await fetch(`${BASE_API_URL}/api/settings`).then(response => response.json()).then((responseBody) => {
            if (responseBody.code === 'SUCCESS') {
                return responseBody.data
            } else {
                throw new Error(responseBody.message)
            }
        })
        .catch(err => {
            console.log(err)
            throw new Error('Something went wrong')
        })
    }
}