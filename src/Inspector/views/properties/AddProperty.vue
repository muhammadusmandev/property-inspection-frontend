<template>
  <div class="add-property-form-container">
    <PageBodyHeader
      heading="Add New Property"
      description="Create new property for your client"
    />
    <CRow>
      <CForm class="row g-3 mt-0" @submit.prevent="submitAddProperty">
        <div class="row g-3 mt-0">
            <CCol md="6">
                <CFormLabel :for="name" class="form-label-required">Name</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cil-user" class="text-info" />
                    </span>
                    <CFormInput 
                        placeholder="Western side house"
                        v-model="name"
                        @blur="nameMeta.touched = true; nameValidate()"
                    />
                </div>
                
                <div class="flex form-field-error d-inline-block mt-2" v-if="nameMeta.touched && nameError">
                    <span>* {{ nameError }}</span>
                </div>
            </CCol>
            <CCol md="6">
                <CFormLabel :for="type" class="form-label-required">Property Type</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilHouse" class="text-info" />
                    </span>
                    <CFormSelect
                        v-model="type"
                        @blur="typeMeta.touched = true; typeValidate()"
                    >
                        <option value="">Choose ...</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                    </CFormSelect>
                </div>
                <div class="flex form-field-error d-inline-block mt-2" v-if="typeMeta.touched && typeError">
                    <span>* {{ typeError }}</span>
                </div>
            </CCol>
        </div>
        
        <FindAddress 
          inputLabel="Find Client Property" 
          inputPlaceHolder="Search property address on map" 
          inputId="findClientProperty"
          :clearFormTrigger="clearFormTrigger"
        />

        <div class="row g-3 mt-0">
            <CCol md="6">
                <CFormLabel :for="client_id">Client</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilUser" class="text-info" />
                    </span>
                    <CFormSelect
                        v-model="client_id"
                        @blur="clientMeta.touched = true; clientValidate()"
                    >                    
                        <option value="">Choose...</option>
                        <option :value="client.id" v-for="(client, idx) in clientsData?.data" :key="idx">{{client.name}}</option>

                    </CFormSelect>
                </div>
                
                <div class="flex form-field-error d-inline-block mt-2" v-if="clientMeta.touched && clientError">
                    <span>* {{ clientError }}</span>
                </div>
            </CCol>
            <CCol md="6">
                <CFormLabel :for="branch_id">Branch</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cibTreehouse" class="text-info" />
                    </span>
                    <CFormSelect
                        v-model="branch_id"
                        @blur="branchMeta.touched = true; branchValidate()"
                    >
                        <option value="">Choose Branch...</option>
                        <option :value="branch.id" v-for="(branch, idx) in branchesData?.data" :key="idx">{{branch.name}}</option>

                    </CFormSelect>
                </div>
                <div class="flex form-field-error d-inline-block mt-2" v-if="branchMeta.touched && branchError">
                    <span>* {{ branchError }}</span>
                </div>
            </CCol>
        </div>

        <CCol xs="12" class="form-buttons-row">
          <CButton color="info" class="text-white mt-3 fs-8" type="submit"><CIcon icon="cilHouse" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Add New Property' }}</CButton>
          <CButton color="danger" class="text-white mt-3 fs-8 ms-2 clear-form-btn" type="button" @click="clearForm"><CIcon icon="cilClearAll" /> Clear Form</CButton>
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
  import FindAddress from '@/components/General/FindAddress.vue'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { addProperty, getInspectorClients, getInspectorBranches } from '@/services/api'
  import { useRouter } from 'vue-router'
  import { useApi } from '@/composables/useApi'

  const clearFormTrigger = ref(0)

  const {data: clientsData, execute: execute1 } = useApi(getInspectorClients, false)
  const {data: branchesData, execute: execute2 } = useApi(getInspectorBranches, false)

  onMounted(async () => {
    await execute1({ queryParameters: { paginate: false } })
    await execute2({ queryParameters: { paginate: false } })
  })

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
    findClientProperty: yup
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
          .required('Name is required.'),
    type: yup
          .string()
          .required('Type is required.'),
    client_id: yup
          .string(),
    branch_id: yup
          .string(),
  }))

  const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: schema
  })

  const { 
    value: client_id, 
    errorMessage: clientError,
    validate: clientValidate,
    meta: clientMeta
  } = useField('client_id');

  const { 
    value: branch_id, 
    errorMessage: branchError,
    validate: branchValidate,
    meta: branchMeta
  } = useField('branch_id');

  const { 
    value: name, 
    errorMessage: nameError,
    validate: nameValidate,
    meta: nameMeta
  } = useField('name');

  const { 
    value: type, 
    errorMessage: typeError,
    validate: typeValidate,
    meta: typeMeta
  } = useField('type');

  function clearForm() {
    resetForm()
    clearFormTrigger.value++
  }

  const { loading: btnLoading, execute } = useApi(addProperty, false)

  const submitAddProperty = handleSubmit(async (formData) => {
    // mutate fields before push
    const response = await execute({ payload: formData })

    if(response.success === true){
      showToast('success', 'Property added successfully!')
      router.push({ name: 'inspector.properties' })
    } 
  })
</script>

<style scoped>
  .add-property-form-container form{
    width: 75%;
  }

  @media (max-width: 480px) {
    .add-property-form-container form{
      width: 100%;
    }

    .add-property-form-container form .clear-form-btn{
      margin-left: 0px !important;
      margin-top: 10px !important;
    }

    .add-property-form-container form .form-buttons-row{
      display: flex;
      flex-direction: column;
    }
  }
</style>