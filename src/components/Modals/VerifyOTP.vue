<template>
    <CModal 
        alignment="center"
        scrollable
        :visible="visibility"
        backdrop="static"
        :keyboard="false"
        aria-labelledby="VerticallyCenteredExample2"
    >
        <CModalHeader :closeButton="false">
            <div class="clearfix w-100">
                <CImage align="center" rounded :src="appLogo" alt="Phone Image" width="130" fluid />
            </div>
        </CModalHeader>
        <CModalBody>
            <CForm class="row g-2 mt-0" @submit.prevent="submitOTPVerification">
                <CCol xs="12">
                    <h2 class="mt-2 fw-bold mb-0 text-center">Account Verification</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Enter OTP Code Sent at: <span class="color-dark">{{ maskedidentifierValue }}</span></p>
                    <div class="row justify-content-between align-items-center mx-0 px-4" @paste="otpTextPaste">
                        <input
                            class="otp-digit"
                            v-for="(digit, idx) in otpDigits"
                            :key="idx"
                            type="text"
                            maxlength="1"
                            inputmode="numeric"
                            autocomplete="otp"
                            v-model="otpDigits[idx]"
                            ref="digitInputs"
                            @input="newDigitInput(idx, $event)"
                            @keydown.backspace="digitRemove(idx, $event)"
                            @keydown.delete="digitRemove(idx, $event)"
                            :disabled="isOtpDisabled"
                        />
                    </div>
                    <div class="flex form-field-error d-block mx-auto mt-3" style="max-width: fit-content" v-if="otpError">
                        <span>* {{ otpError }}</span>
                    </div>
                </CCol>
                <div class="d-grid mt-5">
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit" :disabled="enableSubmit"> <CIcon icon="cilUserPlus" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Verify OTP' }}</CButton>
                    <p class="term-condition-text mt-3 text-body-secondary text-center" v-if="!isOtpDisabled">Don't receive code? Try new one <CButton @click="resendCode" class=" p-0 text-decoration-underline fs-6"> Resend </CButton></p>
                </div>
            </CForm>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { ref, watch, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { verifyOtp, resendOtp } from '@/services/api'
    import { useApi } from '@/composables/useApi'
    import appLogo from '@/assets/images/icons/verification_otp.png'
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { toastNotifications } from '@/composables/toastNotifications'
    
    const props = defineProps({
        visibility: Boolean,
        identifierValue: {
            type: String,
            default: ''
        },
        otpVerificationType: {
            type: String,
            default: ''
        },
    })

    const otpDigits = ref(Array(6).fill(''))
    const digitInputs = ref([])
    const maskedidentifierValue = ref('')
    const otpError = ref('')
    const enableSubmit = ref(true)
    const tooManyAttempts = ref(false)
    const isOtpDisabled = ref(false)
    const emit = defineEmits(['otpSent', 'otpVerified'])

    const router = useRouter()
    const route = useRoute()
    const { showToast } = toastNotifications()
    const { loading: btnLoading, data, execute } = useApi(verifyOtp, false)

    function newDigitInput(idx, event) {
        const value = event.target.value
        if (!/^\d$/.test(value)) {
            otpDigits.value[idx] = ''
            return
        }
        if (idx < 5 && value) {
            nextTick(
                () => digitInputs.value[idx + 1].focus()
            )
        }

        const otp = otpDigits.value.join('')

        if(otp.length === 6 && !tooManyAttempts.value) 
            submitOTPVerification(otp)
    }

    function otpTextPaste(event) {
        const pastedData = (event.clipboardData || window.clipboardData).getData('text')

        if (/^\d{6}$/.test(pastedData)) { // check if 6 digits long
            event.preventDefault()
            otpDigits.value = pastedData.split('')
            nextTick(
                () => digitInputs.value[5].focus()
            )
            const otp = otpDigits.value.join('')
            
            if(otp.length === 6 && !tooManyAttempts.value) 
                submitOTPVerification(otp)
        }
    }

    function digitRemove(idx, event) {
        // remove digit on delete press
        if(otpDigits.value[idx] && (event.key === 'Delete')) 
            otpDigits.value[idx] = ''

        if (idx > 0 && otpDigits.value[idx] === '') {
            nextTick(
                () => digitInputs.value[idx - 1].focus()
            )
        }
    }

    function maskEmail(email) {
        const [str, domainName] = email.split('@')
        const start = str.slice(0, 3)  // start of email first part
        const end = str.slice(-1)     // end of email first part
        const maskedStr = start + '*'.repeat(str.length - 2) + end

        return `${maskedStr}@${domainName}`
    }

    async function submitOTPVerification(otp){
        otpError.value = ''
        const response = await execute({ payload: { identifier: 'email', email: props.identifierValue, otp: otp } })

        if(response.success === true){
            switch (response.data.status) {
                case "invalid":
                    otpError.value = response.response?.data.message
                    break;

                case "expired":
                    otpError.value = response.response?.data.message
                    break;
                
                case "verified":
                    if (route.path === '/realtor/auth/login') {
                        if(props.otpVerificationType === "reset-password"){
                            showToast('success', 'Thanks for verification! Please set your new password.')
                            emit('otpVerified', {email: props.identifierValue, token: response.data.otp_session_token})
                        } else{
                            // Todo: In future save user token if verified for first time from login page
                            isOtpDisabled.value = true
                            showToast('success', 'Thanks for verification! Account verified. Just now login again. Wait redirecting...')
                            setTimeout(() => {
                                window.location.reload()
                            }, 5000)
                        }
                    } else{
                        showToast('success', 'Account verified successfully!')
                        router.push( '/realtor/auth/login' )
                    }
                    break;
            
                default:
                    showToast('error', 'Oops! Something went wrong. Contact support team.')
                    break;
            }
        } else{
            if(response.status === 429){      // request limit exceed
                otpError.value = response.data.errors.error + ' But Try from login page.'
                tooManyAttempts.value = true
                isOtpDisabled.value = true
            }
        }
    }

    watch( () => props.identifierValue,
        (newVal, oldVal) => {
            maskedidentifierValue.value = maskEmail(newVal)
        },
    )

    async function resendCode(params) {
        const { execute: execute1 } = useApi(resendOtp, false)
        const response1 = await execute1({ payload: { identifier: 'email', email: props.identifierValue } })

        if(response1.success === true){
            showToast('success', 'OTP resend successfully!')
        } else{
            showToast('error', 'Oops! Something went wrong. Failed to generate OTP.')
        }
    }
</script>

<style scoped>
    .otp-digit {
        width: 14%;
        height: 60px;
        border: 2px solid #e8e8e8;
        font-size: 2rem;
        background: #f8f9fb;
        text-align: center;
        border-radius: 5px;
        font-weight: 400;
    }
</style>
