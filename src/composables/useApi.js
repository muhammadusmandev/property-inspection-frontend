import { ref } from 'vue'

export function useApi(apiFn, immediate = true, ...args){
    const loading = ref(false)
    const data = ref(null)

    const execute = async (...payload) => {
        loading.value = true

        try {
            const response = await apiFn(
                                ...(payload.length ? payload : args)
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