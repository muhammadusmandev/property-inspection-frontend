import { ref } from 'vue'

export function useApi(apiFn, immediate = true, ...args){
    const loading = ref(false)
    const data = ref(null)
    const error = ref(null)

    const execute = async (...payload) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiFn(
                                ...(payload.length ? payload : args)
                            )
            data.value = response?.data
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    if(immediate){
        execute()
    }

    return {loading, data, error, execute}
}