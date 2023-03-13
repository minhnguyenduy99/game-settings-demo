const BASE_API_URL = import.meta.env.VITE_API_BASE_URL

export class PostmanToSwaggerService {


    async convert(data) {
        const { file, from, to, outputFileName } = data
        const url = new URL(`${BASE_API_URL}/api/docs/convert`)
        url.searchParams.append('from', from)
        url.searchParams.append('to', to)
        url.searchParams.append('outputFileName', outputFileName)

        const formData = new FormData()
        formData.append('file', file)

        return await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                contentType: 'multipart/form-data'
            }
        })
        .then(async (response) => {
            if (response.status !== 200) {
                const body = await response.json()
                throw new Error(body.message)
            }
            const apiDocFile = await response.blob()
            const fileName = response.headers.get('Content-Disposition').split('filename=')[1]

            return {
                blob: apiDocFile,
                fileName: fileName,
            }
        })
        .catch(err => {
            console.log(err)
            throw new Error('Something went wrong')
        })
    }
}