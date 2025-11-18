<template>
  <div class="update-client-form-container">
    <PageBodyHeader
      :heading="pageHeading"
      :description="pageDescription"
    />
    <CRow>
      <CForm class="row g-3 mt-0" @submit.prevent="submitUpdateClient">
        <div class="row g-3 mt-0">
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
                <CFormLabel :for="email" class="mb-1 form-label-required">Email</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilAt" class="text-info" />
                    </span>
                    <CFormInput
                        type="email"
                        placeholder="eg. johndoe@example.com"
                        v-model="email"
                        @blur="emailMeta.touched = true; emailValidate()"
                    />
                </div>
                <div class="flex form-field-error d-inline-block mt-2" v-if="emailMeta.touched && emailError">
                    <span>* {{ emailError }}</span>
                </div>
            </CCol>
            <CCol md="6">
              <CFormLabel :for="phone_number" class="mb-1 form-label-required">Phone</CFormLabel>
              <CInputGroup class="mb-1" style="flex-wrap: nowrap">
                <CInputGroupText>
                  <CIcon icon="cilScreenSmartphone" class="text-info" />
                </CInputGroupText>
                <vue-tel-input
                  v-model="phone_number"
                  :preferred-countries="['us', 'ca']"
                  :inputoptions="{ showDialCode: true, autocomplete: 'tel' }"
                  mode="international"
                  :invalid-msg="invalidPhoneMsg"
                  @validate="onPhoneValidate"
                  @blur="validatePhone"
                  :class="{ 'error': showPhoneError }"
                />
              </CInputGroup>
              <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="phoneError">
                <span>* {{ phoneError }}</span>
              </div>
            </CCol>
            <CCol md="6">
              <CFormLabel :for="gender" class="mb-1 form-label-required">Gender</CFormLabel>
              <CInputGroup class="mb-1">
                <CInputGroupText>
                  <CIcon icon="cil-lock-locked" class="text-info" />
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
        </div>

        <CCol xs="12" class="form-buttons-row">
          <CButton color="info" class="text-white mt-3 fs-8" type="submit" :disabled="btnLoading"><CIcon icon="cilHouse" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Updating...' : 'Update New Client / LandLord' }}</CButton>
          <CButton color="danger" class="text-white mt-3 fs-8 ms-2 delete-form-btn" type="button" @click="handleShowDeleteModal"><CIcon icon="cilClearAll" /> Delete Client / Landlord </CButton>  
        </CCol>
      </CForm>
    </CRow>
  </div>
  <DeleteWarningModal v-model:visibility="showDeleteModal" :btnLoading="deleteBtnLoading" @confirmedDelete="handleDelete" />
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { useRoute, useRouter } from 'vue-router'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { FullPageSpinnerLoader } from '@/components/General/Loader.vue'
  import DeleteWarningModal from '@/components/Modals/DeleteWarningModal.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { getClient, updateClient, deleteClient } from '@/services/api'
  import { useApi } from '@/composables/useApi'
  import { VueTelInput } from 'vue-tel-input'
  import 'vue-tel-input/vue-tel-input.css'

  const pageHeading = ref('');
  const pageDescription = ref('')
  const pageLoading = ref(true)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)
  const phone_number = ref('')
  const phoneValidation = ref(null)
  const phoneError = ref('')
  const invalidPhoneMsg = 'Please enter a valid phone number'
  const showPhoneError = ref(false)
  const phoneTouched = ref(false)

  const route = useRoute()
  const router = useRouter()
  const clientId = route.params.id
  const { showToast } = toastNotifications()

  const { data: clientData, execute: execute1 } = useApi(getClient, false)
  const { loading: btnLoading, execute } = useApi(updateClient, false)
  const { execute: execute2 } = useApi(deleteClient, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [clientId] })
    setupPageFieldsData();
  })

  const schema = toTypedSchema( yup.object({
    first_name: yup
          .string()
          .required('First name is required'),
    last_name: yup
          .string()
          .required('Last name is required'),
    email: yup
          .string()
          .email()
          .max(100, 'Must be 100 characters long')
          .required('Email is required.'),
    gender: yup
          .string()
          .required('Gender is required'),
  }))

  const { handleSubmit, isSubmitting, setFieldValue } = useForm({
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
    value: email, 
    errorMessage: emailError,
    validate: emailValidate,
    meta: emailMeta
  } = useField('email');

  const { 
    value: gender, 
    errorMessage: genderError,
    validate: genderValidate,
    meta: genderMeta
  } = useField('gender');

  function setupPageFieldsData(){
    // set page heading data
    pageHeading.value = clientData.value.name
    pageDescription.value = [clientData.value.email]
        .filter(Boolean)
        .join(', ')
    
    const fullName = clientData.value.name.trim().split(/\s+/);

    const firstName = fullName.shift();
    const lastName = fullName.pop() || '';

    // set form data
    setFieldValue('first_name', firstName)
    setFieldValue('last_name', lastName)
    setFieldValue('email', clientData.value.email)
    setFieldValue('gender', clientData.value.gender)
    phone_number.value = clientData.value.phone_number
  }

  function handleShowDeleteModal() {
     showDeleteModal.value = true
  }

  const onPhoneValidate = (result) => {
    phoneValidation.value = result;
    
    if (phoneTouched.value) {
      if (!result.valid) {
        phoneError.value = result.message || 'Please enter a valid phone number';
        showPhoneError.value = true;
      } else {
        phoneError.value = '';
        showPhoneError.value = false;
      }
    }
  }

  const validatePhone = () => {
    phoneTouched.value = true;
    
    if (!phone_number.value) {
      phoneError.value = 'Phone number is required';
      showPhoneError.value = true;
      return;
    }
    
    if (phoneValidation.value && !phoneValidation.value.valid) {
      phoneError.value = phoneValidation.value.message || 'Please enter a valid phone number';
      showPhoneError.value = true;
    } else {
      phoneError.value = '';
      showPhoneError.value = false;
    }
  }

  const submitUpdateClient = handleSubmit(async (formData) => {
    validatePhone();
    formData.phone_number = phone_number.value
    const response = await execute({ pathParams: [clientId], payload: formData})

    if(response.success === true){
      showToast('success', 'Client updated successfully!')
    } 
  })

  async function handleDelete(){
    deleteBtnLoading.value = true
    const response = await execute2({ pathParams: [clientId]})

    if(response.success === true){
      showToast('success', 'Client deleted successfully!')
      router.push({ name: 'realtor.clients' })
    } else{
        deleteBtnLoading.value = false
        showDeleteModal.value = false
        showToast('error', 'Oops! Something went wrong!')
    }
  }
</script>

<style scoped>
  .update-client-form-container form{
    width: 75%;
  }

  .vue-tel-input {
    border: 1px solid #dbdfe6 !important;
    border-radius: 0.375rem !important;
    font-size: 15px;
    padding: 0.07rem 0.375rem 0.07rem 0rem;
    width: inherit;
  }

  @media (max-width: 480px) {
    .update-client-form-container form{
      width: 100%;
    }

    .update-client-form-container form .delete-form-btn{
      margin-left: 0px !important;
      margin-top: 10px !important;
    }
    
    .update-client-form-container form .form-buttons-row {
      display: flex;
      flex-direction: column;
    }
  }
</style>