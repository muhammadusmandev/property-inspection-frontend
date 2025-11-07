<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="10">
          <CCardGroup class="register-card-group">
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
                  <CButton as="a" href="/realtor/auth/login" class="mt-4 px-4 self-bg-light-dark self-color-tertiary fs-6">
                    <CIcon icon="cilUserPlus" /> Already have an account?
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
            <CCard class="py-2 px-4">
              <CCardBody>
                <CForm class="row g-2 mt-0" @submit.prevent="submitRegisterUser">
                  <div class="clearfix">
                    <CImage align="center" rounded :src="appLogo" alt="Inspexly Logo" width="200" height="200" fluid />
                  </div>
                  <h2 class="mt-4 fw-bold border-top pt-3 mb-0 text-center">Register</h2>
                  <p class="text-body-secondary text-center my-1 mb-4">Let's Get Ready For Creating Your First Report</p>
                  <CCol md="6">
                    <CFormLabel :for="first_name" class="mb-1 form-label-required">First Name</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="John" 
                        autocomplete="first_name"
                        v-model="first_name"
                        @blur="firstnameMeta.touched = true; firstnameValidate()"
                      />
                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="firstnameMeta.touched && firstnameError">
                      <span>* {{ firstnameError }}</span>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel :for="last_name" class="mb-1 form-label-required">Last Name</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Doe" 
                        autocomplete="last_name"
                        v-model="last_name"
                        @blur="lastnameMeta.touched = true; lastnameValidate()" 
                      />
                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="lastnameMeta.touched && lastnameError">
                      <span>* {{ lastnameError }}</span>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel :for="phone_number" class="mb-1 form-label-required">Phone</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cilScreenSmartphone" />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="+1 234-456-7890" 
                        autocomplete="phone_number" 
                        v-model="phone_number"
                        @blur="phoneMeta.touched = true; phoneValidate()"
                      />
                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="phoneMeta.touched && phoneError">
                      <span>* {{ phoneError }}</span>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel :for="email" class="mb-1 form-label-required">Email</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>@</CInputGroupText>
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
                  <CCol md="6">
                    <CFormLabel :for="password" class="mb-1 form-label-required">Password</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Example989@#$"
                        autocomplete="new-password"
                        v-model="password"
                        @blur="passwordMeta.touched = true; passwordValidate()"
                      />
                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="passwordMeta.touched && passwordError">
                      <span>* {{ passwordError }}</span>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel :for="cpassword" class="mb-1 form-label-required">Confirm Password</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Example989@#$"
                        autocomplete="cpassword"
                        v-model="cpassword"
                        @blur="cpasswordMeta.touched = true; cpasswordValidate()"
                      />
                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="cpasswordMeta.touched && cpasswordError">
                      <span>* {{ cpasswordError }}</span>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel :for="gender" class="mb-1 form-label-required">Gender</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormSelect
                          v-model="gender"
                          @blur="genderMeta.touched = true; genderValidate()"
                      >
                          <option value="">Choose Gender...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                      </CFormSelect>
                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="genderMeta.touched && genderError">
                      <span>* {{ genderError }}</span>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel :for="date_of_birth" class="mb-1 form-label-required">Date of Birth</CFormLabel>
                    <CInputGroup class="mb-1">
                      <CInputGroupText>
                        <CIcon icon="cil-calendar" />
                      </CInputGroupText>
                      <Datepicker
                        class="form-control p-0 border-0"
                        placeholder="Select your date of birth"
                        :enable-time-picker="false"
                        :hide-input-icon="true"
                        :start-date="fifteenYearsAgo"
                        :max-date="fifteenYearsAgo"
                        :min-date="new Date(1920, 1, 1)"
                        v-model="date_of_birth"
                        @blur="dobMeta.touched = true; dobValidate()"
                      />

                    </CInputGroup>
                    <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="dobMeta.touched && dobError">
                      <span>* {{ dobError }}</span>
                    </div>
                  </CCol>
                  <div class="mx-auto text-center">
                    <p class="term-condition-text mt-3 text-body-secondary">By continuing, you agree to our <span class="fw-bold color-dark">Terms</span>. Learn how we collect, use and share your data in our <span class="fw-bold color-dark">Privacy Policy</span>.</p>
                  </div>
                  <div class="d-grid">
                    <CButton color="primary" class="px-4 self-button w-50 mx-auto" type="submit"> <CIcon icon="cilUserPlus" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Create Free Account' }} </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  <VerifyOTP :visibility="showVerifyOTPModal" :identifierValue="identifierValue" :otpVerificationType="otpVerificationType" />
</template>

<script setup>
  import { ref } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup';
  import { registerUser } from '@/services/api'
  import { useApi } from '@/composables/useApi'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import VerifyOTP from '@/components/Modals/VerifyOTP.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import appLogo from '@/assets/images/Inspexly_logo.jpg'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import Datepicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import dateTimeToDateISO from '@/utils/datetimeFormatter'

  const showVerifyOTPModal = ref(false)
  const identifierValue = ref(null)
  const otpVerificationType = ref('')
  const fifteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 15))

  const authStore = useAuthStore()
  const { showToast } = toastNotifications()
  const router = useRouter()
  const { loading: btnLoading, data, execute } = useApi(registerUser, false)

  const schema = toTypedSchema( yup.object({
    first_name: yup
          .string()
          .required('First name is required'),
    last_name: yup
          .string()
          .required('Last name is required'),
    phone_number: yup
          .string()
          .required('Phone is required'),
    email: yup
          .string()
          .email('Invalid email')
          .required('Email is required'),
    password: yup
          .string()
          .min(8, 'Min 8 characters')
          .required('Password is required'),
    cpassword: yup
          .string()
          .min(8, 'Min 8 characters')
          .required('Confirm Password is required'),
    gender: yup
          .string()
          .required('Gender is required'),
    date_of_birth: yup
          .date()
          .typeError('Date of birth must be valid')
          .max(new Date(), 'Date of birth cannot be future date')
          .max(fifteenYearsAgo, 'You must be at least 15 years old')
          .required('Date of birth is required'),
  }))

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema
  })

  const { 
    value: first_name, 
    errorMessage: firstnameError,
    validate: firstnameValidate,
    meta: firstnameMeta
  } = useField('first_name');

  const { 
    value: last_name, 
    errorMessage: lastnameError,
    validate: lastnameValidate,
    meta: lastnameMeta
  } = useField('last_name');

  const { 
    value: phone_number, 
    errorMessage: phoneError,
    validate: phoneValidate,
    meta: phoneMeta
  } = useField('phone_number');

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

  const { 
    value: cpassword, 
    errorMessage: cpasswordError,
    validate: cpasswordValidate,
    meta: cpasswordMeta
  } = useField('cpassword');

  const { 
    value: gender, 
    errorMessage: genderError,
    validate: genderValidate,
    meta: genderMeta
  } = useField('gender');

  const { 
    value: date_of_birth, 
    errorMessage: dobError,
    validate: dobValidate,
    meta: dobMeta
  } = useField('date_of_birth');

  const submitRegisterUser = handleSubmit(async (formData) => {
    formData.date_of_birth = dateTimeToDateISO(formData.date_of_birth)
    const response = await execute({ payload: formData })

    if(response.success === true){
      showToast('success', 'Register successfully! Please verify your account now.')
      // display verification modal
      showVerifyOTPModal.value = true
      identifierValue.value = formData.email
      otpVerificationType.value = 'registration'
    } else{
      // handle any case if concerned error data
    }
  })
</script>

<style scoped>
  .register-card-group{
    box-shadow: 6px 15px 35px 8px rgba(0,0,0,0.11);
    -webkit-box-shadow: 6px 15px 35px 8px rgba(0,0,0,0.11);
    -moz-box-shadow: 6px 15px 35px 8px rgba(0,0,0,0.11);
  }
  .term-condition-text{
    font-size: 0.91rem;
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