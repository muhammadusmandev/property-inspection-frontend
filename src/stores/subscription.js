import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getSubscriptionData } from '@/services/api'
import { useApi } from '@/composables/useApi'

export const useSubscriptionStore = defineStore('subscription', () => {
    const subscription = ref(null)
    const lastFetched = ref(null)

    // Todo: Implement subscription validity check on webhook update
    const {data, execute } = useApi(getSubscriptionData, false)

    const isLoaded = computed(() => !!subscription.value)
    const isStale = computed(() => {
        if (!lastFetched.value) return true
        
        return Date.now() - lastFetched.value > 30 * 60 * 1000    // After 30 minutes
    })

    async function getStatus() {
        try {
            if (subscription.value && !isStale.value) {
                // Already loaded & fresh data
                return subscription.value
            }
            await execute()
            lastFetched.value = Date.now()
            subscription.value = data.value

            localStorage.setItem('sub_last_fetch_time', lastFetched.value)

            console.log(data.value)
            return data.value
        } catch (e) {
            console.error('Subscription fetch failed. Please try again later.', error)
            return null
        }
    }

    const status = computed(() => {
        if (!subscription.value.is_subscribed)
            return 'non_subscribe'

        if (subscription.value.on_trial && new Date(subscription.value.trial_end) > new Date())
            return 'trial_active'

        if (!subscription.value.active && !subscription.value.on_trial && subscription.value.ended)
            return 'expired'

        if (subscription.value.cancelled && !subscription.value.active)
            return 'cancelled'

        if (subscription.value.active)
            return 'active'
    })

    function clearSubscription() {
        data.value = null
        lastFetched.value = null
        localStorage.removeItem('sub_last_fetch_time')
    }

    return { status, isLoaded, getStatus, clearSubscription }
})
