<template>
  <div class="add-property-form-container">
    <PageBodyHeader
      heading="Add New Branch"
      description="Create new Branch for your properties"
    />
    <CRow>
      <CForm class="row g-3 mt-0 w-75" @submit.prevent="submitAddBranch">
        <CCol md="12">
            <CFormLabel :for="name" class="form-label-required">Branch Name</CFormLabel>
            <div class="input-group">
                <span class="input-group-text">
                    <CIcon icon="cilLocationPin" class="text-info" />
                </span>
                <CFormInput 
                    placeholder="Branch Name 1"
                    v-model="name"
                    @blur="nameMeta.touched = true; nameValidate()"
                />
            </div>
            
            <div class="flex form-field-error d-inline-block mt-2" v-if="nameMeta.touched && nameError">
                <span>* {{ nameError }}</span>
            </div>
        </CCol>

        <FindAddress 
          inputLabel="Find branch Address" 
          inputPlaceHolder="Search branch address on map" 
          inputId="findBranchProperty"
          :clearFormTrigger="clearFormTrigger"
        />

        <CCol xs="12">
          <CButton color="info" class="text-white mt-3" type="submit"><CIcon icon="cilHouse" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Add New Branch' }}</CButton>
          <CButton color="danger" class="text-white mt-3 ms-2" type="button" @click="clearForm"><CIcon icon="cilClearAll" /> Clear Form</CButton>
        </CCol>
      </CForm>
    </CRow>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import FindAddress from '@/components/General/FindAddress.vue'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { addRealtorBranch } from '@/services/api'
  import { useRouter } from 'vue-router'
  import { useApi } from '@/composables/useApi'

  const clearFormTrigger = ref(0)

  const { showToast } = toastNotifications()
  const router = useRouter()

  const postalCodePatterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    AU: /^\d{4}$/,
    NL: /^\d{4}\s?[A-Za-z]{2}$/,
  }

  const schema = toTypedSchema( yup.object({
    findBranchProperty: yup
          .string()
          .max(150, 'Must be 150 characters long'),
    address: yup
          .string()
          .required('Must add address.')
          .min(5, 'Must be atleast 5 characters long')
          .max(100, 'Must be 100 characters long'),
    address_2: yup
          .string()
          .max(100, 'Must be 100 characters long'),
    city: yup
          .string()
          .required('Must add city.')
          .min(2, 'Must be atleast 2 characters long')
          .max(50, 'Must be 50 characters long'),
    state: yup
          .string()
          .max(50, 'Must be 50 characters long'),
    postal_code: yup
          .string()
          .required('Must add zip code.')
          .when('country', (country, schema) => { // temp 'US' else dynamic
            const regex = postalCodePatterns[country]    
            return regex
              ? schema.matches(regex, `ZIP code must be valid for ${country}`)
              : schema
          }),
    country: yup
          .string()
          .required('Must select country.'),
    name: yup
          .string()
          .max(100, 'Must be 100 characters long')
          .required('Name is required.')
  }))

  const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: schema
  })

  const { 
    value: name, 
    errorMessage: nameError,
    validate: nameValidate,
    meta: nameMeta
  } = useField('name');

  function clearForm() {
    resetForm()
    clearFormTrigger.value++
  }

  const { loading: btnLoading, execute } = useApi(addRealtorBranch, false)

  const submitAddBranch = handleSubmit(async (formData) => {
    console.log(formData)
    const response = await execute({ payload: formData })

    if(response.success === true){
      showToast('success', 'Branch added successfully!')
      router.push({ name: 'realtor.branches' })
    } 
  })
</script>