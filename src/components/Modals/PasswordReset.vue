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
            <CForm class="row g-2 mt-0" @submit.prevent="resetPassword">
                <CCol xs="12">
                    <h2 class="mt-2 fw-bold mb-0 text-center">Reset Password</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Enter your email address to reset password</p>
                    <CCol xs="10" class="mx-auto mt-4 pt-2">
                        <CFormLabel :for="email" class="text-start mb-0 form-label-required">Email</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <CFormInput
                            placeholder="johndoe@example.com"
                            autocomplete="email"
                            v-model="email"
                            @blur="emailMeta.touched = true; emailValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="emailMeta.touched && emailError">
                            <span>* {{ emailError }}</span>
                        </div>
                    </CCol>
                </CCol>
                <div class="d-grid mt-5">
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit"> <CIcon icon="cilUserPlus" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Sending...' : 'Reset Password' }}</CButton></div>
            </CForm>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import { resendOtp } from '@/services/api'
    import { useApi } from '@/composables/useApi'
    import verificationImg from '@/assets/images/icons/verification_otp.png'
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { toastNotifications } from '@/composables/toastNotifications'
    
    const props = defineProps({
        visibility: Boolean
    })

    const emit = defineEmits(['otpSent'])

    const { showToast } = toastNotifications()
    const { loading: btnLoading, execute: execute } = useApi(resendOtp, false)

    const schema = toTypedSchema( yup.object({
        email: yup
            .string()
            .email('Invalid email')
            .required('Email required')
    }))

    const { handleSubmit, isSubmitting } = useForm({
        validationSchema: schema
    })

    const { 
        value: email, 
        errorMessage: emailError,
        validate: emailValidate,
        meta: emailMeta
    } = useField('email');

    const resetPassword = handleSubmit(async (formData) => {
        const response = await execute({ payload: { identifier: 'email', email: formData.email } })

        if(response.success === true){
            showToast('success', 'OTP send successfully! Check your email.')
            emit('otpSent', formData.email)
        } else{
            showToast('error', 'Oops! Something went wrong. Failed to generate OTP.')
        }
    })
</script>