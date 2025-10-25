<template>
  <div class="add-property-form-container">
    <PageBodyHeader
      :heading="pageHeading"
      :description="pageDescription"
    />
    <CRow>
      <CForm class="row g-3 mt-0 w-75" @submit.prevent="submitUpdateProperty">
        <FindAddress 
          inputLabel="Find Client Property" 
          inputPlaceHolder="Search property address on map" 
          inputId="findClientProperty"
        />

        <div class="row g-3 mt-0">
            <CCol md="6">
                <CFormLabel :for="name" class="form-label-required">Name</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilLocationPin" class="text-info" />
                    </span>
                    <CFormInput 
                        placeholder="Western Side House"
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
                        <option :value="client.id" v-for="(client, idx) in clientsData" :key="idx">{{client.name}}</option>

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
                        <option :value="branch.id" v-for="(branch, idx) in branchesData" :key="idx">{{branch.name}}</option>

                    </CFormSelect>
                </div>
                <div class="flex form-field-error d-inline-block mt-2" v-if="branchMeta.touched && branchError">
                    <span>* {{ branchError }}</span>
                </div>
            </CCol>
              <CCol md="12">
                  <CFormLabel :for="reference">Reference</CFormLabel>
                  <div class="input-group">
                      <span class="input-group-text">
                          <CIcon icon="cilColorBorder" class="text-info" />
                      </span>
                      <CFormInput
                          placeholder="Add property #023123"
                          v-model="reference"
                          @blur="referenceMeta.touched = true; referenceValidate()"
                      />
                  </div>
                  <div class="flex form-field-error d-inline-block mt-2" v-if="referenceMeta.touched && referenceError">
                      <span>* {{ referenceError }}</span>
                  </div>
              </CCol>

              <CCol md="12">
                  <CFormLabel :for="notes">Additional Notes</CFormLabel>
                  <div class="input-group">
                      <span class="input-group-text">
                          <CIcon icon="cilShortText" class="text-info" />
                      </span>
                      <CFormTextarea
                          placeholder="Add additional information..."
                          rows="4"
                          v-model="notes"
                          @blur="notesMeta.touched = true; notesValidate()"
                      ></CFormTextarea>
                  </div>
                  
                  <div class="flex form-field-error d-inline-block mt-2" v-if="notesMeta.touched && notesError">
                      <span>* {{ notesError }}</span>
                  </div>
              </CCol>
        </div>

        <CCol xs="12">
          <CButton color="info" class="text-white mt-3" type="submit"><CIcon icon="cilHouse" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Updating...' : 'Update Property' }}</CButton>
          <CButton color="danger" class="text-white mt-3 ms-2" type="button" @click="handleShowDeleteModal"><CIcon icon="cilClearAll" /> Delete Property </CButton>
        </CCol>
      </CForm>
    </CRow>
  </div>
  <DeleteWarningModal v-model:visibility="showDeleteModal" :btnLoading="deleteBtnLoading" @confirmedDelete="handleDelete" />
</template>

<script setup lang="ts">
  import { ref, reactive, onBeforeMount } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { useRoute, useRouter } from 'vue-router'
  import FindAddress from '@/components/General/FindAddress.vue'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { FullPageSpinnerLoader } from '@/components/General/Loader.vue'
  import DeleteWarningModal from '@/components/Modals/DeleteWarningModal.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { getProperty, updateProperty, getRealtorClients, getRealtorBranches, deleteProperty } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const pageHeading = ref('');
  const pageDescription = ref('')
  const pageLoading = ref(true)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)

  const route = useRoute()
  const router = useRouter()
  const propertyId = route.params.id
  const { showToast } = toastNotifications()

  const { data: propertyData, execute: execute1 } = useApi(getProperty, false)
  const { data: clientsData, execute: execute2 } = useApi(getRealtorClients, false)
  const { data: branchesData, execute: execute3 } = useApi(getRealtorBranches, false)
  const { loading: btnLoading, execute } = useApi(updateProperty, false)
  const { execute: execute4 } = useApi(deleteProperty, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [propertyId] })
    await execute2()
    await execute3()
    setupPageFieldsData();
  })

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
          .max(100, 'Must be 100 characters long')
          .notRequired(),
    city: yup
          .string()
          .required('Must add city.')
          .min(2, 'Must be atleast 2 characters long')
          .max(50, 'Must be 50 characters long'),
    state: yup
          .string()
          .max(50, 'Must be 50 characters long')
          .notRequired(),
    postal_code: yup
          .string()
          .required('Must add zip code.')
          .when('country', (country, schema) => {
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
          .string()
          .notRequired(),
    branch_id: yup
          .string()
          .notRequired(),
    reference: yup
          .string()
          .max(100, 'Must be 100 characters long')
          .notRequired(),
    notes: yup
          .string()
          .max(500, 'Must be 500 characters long')
          .notRequired(),
  }))

  const { handleSubmit, isSubmitting, setFieldValue } = useForm({
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

  const { 
    value: reference, 
    errorMessage: referenceError,
    validate: referenceValidate,
    meta: referenceMeta
  } = useField('reference');

  const { 
    value: notes, 
    errorMessage: notesError,
    validate: notesValidate,
    meta: notesMeta
  } = useField('notes');

  function setupPageFieldsData(){
    // set page heading data
    pageHeading.value = propertyData.value.name
    pageDescription.value = [propertyData.value.address, propertyData.value.address_2, propertyData.value.city, propertyData.value.state, propertyData.value.postal_code]
        .filter(Boolean)
        .join(', ')

    // set form data
    setFieldValue('address', propertyData.value.address)
    setFieldValue('address_2', propertyData.value.address_2)
    setFieldValue('city', propertyData.value.city)
    setFieldValue('state', propertyData.value.state)
    setFieldValue('postal_code', propertyData.value.postal_code)
    setFieldValue('country', propertyData.value.country)
    setFieldValue('name', propertyData.value.name)
    setFieldValue('type', propertyData.value.type)
    setFieldValue('client_id', propertyData.value.client_id)
    setFieldValue('branch_id', propertyData.value.branch_id)
    setFieldValue('reference', propertyData.value.reference)
    setFieldValue('notes', propertyData.value.notes)
  }

  function handleShowDeleteModal() {
     showDeleteModal.value = true
  }

  const submitUpdateProperty = handleSubmit(async (formData) => {
    console.log(formData)
    const response = await execute({ pathParams: [propertyId], payload: formData})

    if(response.success === true){
      showToast('success', 'Property updated successfully!')
    } 
  })

  async function handleDelete(){
    deleteBtnLoading.value = true
    const response = await execute4({ pathParams: [propertyId]})

    if(response.success === true){
      showToast('success', 'Property deleted successfully!')
      router.push({ name: 'realtor.properties' })
    } else{
        deleteBtnLoading.value = false
        showDeleteModal.value = false
        showToast('error', 'Oops! Something went wrong!')
    }
  }
</script>