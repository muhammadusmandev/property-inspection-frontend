<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="10">
          <CCardGroup class="login-card-group">
            <CCard class="p-4">
              <CCardBody>
                <CForm class="row g-2 text-center mt-0" @submit.prevent="submitLoginUser">
                  <div class="clearfix">
                    <CImage align="center" rounded :src="appLogo" alt="Inspexly Logo" width="250" height="200" fluid />
                  </div>
                  <h2 class="mt-4 fw-bold border-top pt-3 mb-0">Login</h2>
                  <p class="text-body-secondary my-1">Access your connected space</p>
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
                  <CFormLabel :for="password" class="text-start mb-0 form-label-required">Password</CFormLabel>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                      @blur="passwordMeta.touched = true; passwordValidate()"
                    />
                  </CInputGroup>
                  <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="passwordMeta.touched && passwordError">
                    <span>* {{ passwordError }}</span>
                  </div>
                  <CRow class="mt-4">
                    <CCol :xs="6" class="text-start">
                      <CButton color="primary" class="px-4 self-button" type="submit"> <CIcon icon="cilLockUnlocked" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Login' }} </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-end">
                      <CButton color="link" @click="showResetPasswordModal" class="px-0 self-color-primary">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white" style="max-width: 40%">
              <CCardBody class="text-center bg-wrapper position-relative">
                <div class="bg-image"></div>
                <div class="bg-overlay"></div>
                <div class="overlay-content">
                  <CIcon icon="cilHouse" size="3xl" class="mb-3 house-icon" />
                  <h3 class="mb-3 text-uppercase fw-bold text-white">Generate First Report</h3>
                  <p class="mb-1">
                    <CIcon icon="cilArrowThickRight" /> Automated Property Inspection Reports
                  </p>
                  <p class="mb-1">
                    <CIcon icon="cilArrowThickRight" /> Centralized Task & Maintenance Management
                  </p>
                  <p class="mb-1">
                    <CIcon icon="cilArrowThickRight" /> Client & Team Collaboration Tools
                  </p>
                  <CButton as="a" href="/realtor/auth/register" class="mt-4 px-4 self-bg-light-dark self-color-tertiary fs-6">
                    <CIcon icon="cilUserPlus" /> Create Your Free Account
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  <VerifyOTP :visibility="showVerifyOTPModal" :identifierValue="identifierValue" :otpVerificationType="otpVerificationType" @otpVerified="handleOtpVerified" />
  <NewPassword :visibility="showNewPasswordModal" :identifierValue="identifierValue" :otpVerificationToken="otpVerificationToken" />
  <PasswordReset :visibility="showPasswordReset" @otpSent="handleOtpSent(email)" />
</template>

<script setup>
  import { ref, readonly } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { loginUser, resendOtp } from '@/services/api'
  import { useApi } from '@/composables/useApi'
  import VerifyOTP from '@/components/Modals/VerifyOTP.vue'
  import PasswordReset from '@/components/Modals/PasswordReset.vue'
  import NewPassword from '@/components/Modals/NewPassword.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import appLogo from '@/assets/images/Inspexly_logo.jpg'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'

  const role = ref('realtor')
  const userRole = readonly(role)
  const loginError = ref('')
  const showVerifyOTPModal = ref(false)
  const showNewPasswordModal = ref(false)
  const otpVerificationToken = ref('')
  const showPasswordReset = ref(false)
  const identifierValue = ref('')
  const otpVerificationType = ref('')

  const { loading: btnLoading, data, execute } = useApi(loginUser, false)

  const schema = toTypedSchema( yup.object({
    email: yup
          .string()
          .email('Invalid email')
          .required('Email required'),
    password: yup
          .string()
          .min(8, 'Min 8 characters')
          .required('Password is required'),
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

  const { 
    value: password, 
    errorMessage: passwordError,
    validate: passwordValidate,
    meta: passwordMeta
  } = useField('password');

  const authStore = useAuthStore()
  const { showToast } = toastNotifications()
  const router = useRouter()

  const submitLoginUser = handleSubmit(async (formData) => {
    const response = await execute({ payload: formData })

    if(response.success === true){
      authStore.setUserData(data.value.user)
      authStore.setToken(data.value.token.text, data.value.token.expires_at)
      showToast('success', 'Logged in successfully!')
      router.push( '/realtor/dashboard' )
    } else{
      if(response.status === 403){
          if(response.data?.errors?.flag === 'email_non_verified'){
            // send otp now first
            const { execute: execute1 } = useApi(resendOtp, false)
            const response1 = await execute1({ payload: { identifier: 'email', email: formData.email } })

            if(response1.success === true){
              // display verification modal
              showVerifyOTPModal.value = true
              identifierValue.value = formData.email
            } else{
              showToast('error', 'Oops! Something went wrong. Failed to generate OTP.')
            }
          } else if(response.data?.errors?.flag === 'inactive'){
            showToast('warning', 'Your account has been deactivated. Contact support for further assistance.')
          }
      }
    }
  })

  function showResetPasswordModal() {
    // display reset password modal
    showPasswordReset.value = true
  }

  function handleOtpSent(email) {
    showPasswordReset.value = false
    // display verify otp modal
    showVerifyOTPModal.value = true
    identifierValue.value = email
    otpVerificationType.value = 'reset-password'
  }

  function handleOtpVerified(payload){
    showVerifyOTPModal.value = false
    // display new password modal
    showNewPasswordModal.value = true
    identifierValue.value = payload.email
    otpVerificationToken.value = payload.token
  }
</script>

<style scoped>
  .login-card-group{
    box-shadow: 6px 15px 35px 8px rgba(0,0,0,0.11);
    -webkit-box-shadow: 6px 15px 35px 8px rgba(0,0,0,0.11);
    -moz-box-shadow: 6px 15px 35px 8px rgba(0,0,0,0.11);
  }

  .bg-wrapper {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bg-image {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/bg/login-overlay-img1.jpg');
    background-size: cover;
    background-position: center;
    z-index: 1;
  }

  .bg-overlay {
    position: absolute;
    inset: 0;
    background-color: var(--self-color-primary);
    opacity: 0.9;
    z-index: 2;
  }

  .overlay-content {
    z-index: 99;
    position: relative;
  }

  .overlay-content p {
    color: #d4f6ff;
  }

  .overlay-content .house-icon{
    color: #ffffff;
    border: 3px solid #06c8ff;
    border-radius: 10%;
    padding: 3px
  }
</style>