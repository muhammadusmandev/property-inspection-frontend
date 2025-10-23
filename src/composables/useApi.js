import { ref } from 'vue'

export function useApi(apiFn, immediate = true, ...args){
    const loading = ref(false)
    const data = ref(null)

    const execute = async ({ pathParams = '', payload = {}, queryParameters = {} } = {}) => {
        loading.value = true
        console.log(args)
        try {
            const pathParamsStr = Array.isArray(pathParams) ? pathParams.join('/') : pathParams  // create path parameters

            const queryString = new URLSearchParams(queryParameters).toString() // create query string
            const fullUrl = queryString ? `${pathParamsStr}?${queryString}` : pathParamsStr

            const response = await apiFn( 
                                payload,
                                fullUrl
                            )
            data.value = response?.data.data
            
            return {
                success: true, 
                data: data.value, 
                response: response
            };
        } catch (e) {
            
            return {
                success: false, 
                status: e.response?.status, 
                data: e.response?.data, 
                response: e.response
            };
        } finally {
            loading.value = false
        }
    }

    if(immediate){
        execute()
    }

    return {loading, data, execute}
}