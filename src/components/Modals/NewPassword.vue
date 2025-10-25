<template>
    <CModal 
        alignment="center"
        scrollable
        :visible="visibility"
        backdrop="static"
        :keyboard="false"
    >
        <CModalHeader :closeButton="false">
            <div class="clearfix w-100">
                <CImage align="center" rounded :src="verificationImg" alt="Phone Image" width="130" fluid />
            </div>
        </CModalHeader>
        <CModalBody>
            <CForm class="row g-2 mt-0" @submit.prevent="newPassword">
                <CCol xs="12">
                    <h2 class="mt-2 fw-bold mb-0 text-center">New Password</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Enter your new Password</p>
                    <CCol xs="10" class="mx-auto mt-4 pt-2">
                        <CFormLabel :for="password" class="text-start mb-0 form-label-required">Password</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Mixed charaters (eg. Qrty8$6&)"
                                type="password"
                                v-model="password"
                                @blur="passwordMeta.touched = true; passwordValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="passwordMeta.touched && passwordError">
                            <span>* {{ passwordError }}</span>
                        </div>
                    </CCol>
                    <CCol xs="10" class="mx-auto mt-3 pt-2">
                        <CFormLabel :for="password" class="text-start mb-0 form-label-required">Confirm Password</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Mixed charaters (eg. Qrty8$6&)"
                                type="password"
                                v-model="cpassword"
                                @blur="cpasswordMeta.touched = true; cpasswordValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="cpasswordMeta.touched && cpasswordError">
                            <span>* {{ cpasswordError }}</span>
                        </div>
                    </CCol>
                </CCol>
                <div class="d-grid mt-3 mb-3">
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit"> <CIcon icon="cilUserPlus" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Reseting...' : 'Reset Now' }}</CButton></div>
            </CForm>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import { resetPassword } from '@/services/api'
    import { useApi } from '@/composables/useApi'
    import verificationImg from '@/assets/images/icons/verification_otp.png'
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { toastNotifications } from '@/composables/toastNotifications'
    import { useRouter } from 'vue-router'
    
    const props = defineProps({
        visibility: Boolean,
        identifierValue: {
            type: String,
            default: ''
        },
        otpVerificationToken: {
            type: String,
            default: ''
        }
    })
    const router = useRouter()
    const emit = defineEmits(['otpSent'])

    const { showToast } = toastNotifications()
    const { loading: btnLoading, execute: execute } = useApi(resetPassword, false)

    const schema = toTypedSchema( yup.object({
        password: yup
            .string()
            .min(8, 'Min 8 characters')
            .required('Password is required'),
        cpassword: yup
            .string()
            .min(8, 'Min 8 characters')
            .required('Confirm Password is required'),
    }))

    const { handleSubmit, isSubmitting } = useForm({
        validationSchema: schema
    })

    const { 
        value: password, 
        errorMessage: passwordError,
        validate: passwordValidate,
        meta: passwordMeta
    } = useField('password');

    const { 
        value: cpassword, 
        errorMessage: cpasswordError,
        validate: cpasswordValidate,
        meta: cpasswordMeta
    } = useField('cpassword');

    const newPassword = handleSubmit(async (formData) => {
        const response = await execute({ payload: { identifier: 'email', password: formData.password, otp_session_token: props.otpVerificationToken, email: props.identifierValue} })

        if(response.success === true){
            showToast('success', 'Password changed successfully! Wait redirecting...')
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else{
            showToast('error', 'Oops! Something went wrong. Failed to generate OTP.')
        }
    })
</script>
