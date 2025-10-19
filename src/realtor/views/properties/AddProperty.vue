<template>
  <div>
    <CRow>
      <CForm class="row g-3" @submit.prevent="submitAddProperty">
        <FindAddress 
          inputLabel="Find Client Property" 
          inputPlaceHolder="Search property address on map" 
          inputId="findClientProperty"
          :clearFormTrigger="clearFormTrigger"
          @click="handleManualAdd"
        />

        <CCol xs="12">
          <CButton color="info" class="text-white mt-3" type="submit"><CIcon icon="cilHouse" /> Add New Property</CButton>
          <CButton color="danger" class="text-white mt-3 ms-2" type="button" @click="clearForm"><CIcon icon="cilClearAll" /> Clear Form</CButton>
        </CCol>
      </CForm>
    </CRow>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import FindAddress from '@/components/General/FindAddress.vue'

  const clearFormTrigger = ref(0)

  const schema = toTypedSchema( yup.object({
    findClientProperty: yup
          .string()
          .required('Must add location.')
          .min(5, 'Must be atleast 5 characters long')
          .max(150, 'Must be 150 characters long'),
    inputAddress: yup
          .string()
          .required('Must add address.')
          .min(5, 'Must be atleast 5 characters long')
          .max(100, 'Must be 100 characters long'),
    inputAddress2: yup
          .string()
          .min(5, 'Must be atleast 5 characters long')
          .max(100, 'Must be 100 characters long'),
    inputCity: yup
          .string()
          .required('Must add city.')
          .min(2, 'Must be atleast 2 characters long')
          .max(50, 'Must be 50 characters long'),
    inputState: yup
          .string()
          .required('Must select state.'),
    inputZip: yup
          .number('Must be valid zip code.')
          .typeError('Must be valid zip code.')
          .required('Must add zip code.')
          .min(10000, 'Must be valid zip code.')
          .max(99999, 'Must be valid zip code.')
          .integer('Must be valid zip code.'),
    inputCountry: yup
          .string()
          .required('Must select country.'),
  }))

  const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: schema
  })

  function handleManualAdd() {
    console.log('Manual add pressed...')
  }

  function clearForm() {
    resetForm()
    clearFormTrigger.value++
  }

  const submitAddProperty = handleSubmit(async (formData) => {
    console.log(formData)
  })
</script>