<template>
  <div class="add-client-form-container">
    <PageBodyHeader
      heading="Add New Client / Landlord"
      description="Create new Client / Landlord for properties"
    />
    <CRow>
      <CForm class="row g-3 mt-0 w-75" @submit.prevent="submitAddClient">
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
                <CFormLabel :for="email" class="form-label-required">Email</CFormLabel>
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
              <CInputGroup class="mb-1">
                <CInputGroupText>
                  <CIcon icon="cilScreenSmartphone" class="text-info" />
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

        <CCol xs="12">
          <CButton color="info" class="text-white mt-3" type="submit"><CIcon icon="cilHouse" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Add New Client / LandLord' }}</CButton>
          <CButton color="danger" class="text-white mt-3 ms-2" type="button" @click="clearForm"><CIcon icon="cilClearAll" /> Clear Form</CButton>
        </CCol>
      </CForm>
    </CRow>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { addClient } from '@/services/api'
  import { useRouter } from 'vue-router'
  import { useApi } from '@/composables/useApi'

  const clearFormTrigger = ref(0)

  const { showToast } = toastNotifications()
  const router = useRouter()

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
    phone_number: yup
          .string()
          .required('Phone is required'),
    gender: yup
          .string()
          .required('Gender is required'),
  }))

  const { handleSubmit, isSubmitting, resetForm } = useForm({
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
    value: phone_number, 
    errorMessage: phoneError,
    validate: phoneValidate,
    meta: phoneMeta
  } = useField('phone_number');

  const { 
    value: gender, 
    errorMessage: genderError,
    validate: genderValidate,
    meta: genderMeta
  } = useField('gender');

  function clearForm() {
    resetForm()
    clearFormTrigger.value++
  }

  const { loading: btnLoading, execute } = useApi(addClient, false)

  const submitAddClient = handleSubmit(async (formData) => {
    const response = await execute({ payload: formData })

    if(response.success === true){
      showToast('success', 'Client / Landlord added successfully!')
      router.push({ name: 'realtor.clients' })
    } 
  })
</script>