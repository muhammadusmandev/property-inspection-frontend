<template>
  <div class="update-branch-form-container">
    <PageBodyHeader
      :heading="pageHeading"
      :description="pageDescription"
    />
    <CRow>
      <CForm class="row g-3 mt-0" @submit.prevent="submitUpdateBranch">
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
        />

        <div class="row g-3 mt-0">
            <CCol md="6">
                <CFormLabel :for="associated_property_id">Associate Property</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilUser" class="text-info" />
                    </span>
                    <CFormSelect
                        v-model="associated_property_id"
                        @blur="associatedPropertyIdMeta.touched = true; associatedPropertyIdValidate()"
                    >                    
                        <option value="">Choose...</option>
                        <option :value="property.id" v-for="(property, idx) in propertiesData1" :key="idx">{{property.name}}</option>

                    </CFormSelect>
                </div>
                
                <div class="flex form-field-error d-inline-block mt-2" v-if="associatedPropertyIdMeta.touched && associatedPropertyIdError">
                    <span>* {{ associatedPropertyIdError }}</span>
                </div>
            </CCol>      
        </div>

        <CCol xs="12" class="form-buttons-row">
          <CButton color="info" class="text-white mt-3 fs-8" type="submit"><CIcon icon="cilHouse" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Updating...' : 'Update Property' }}</CButton>
          <CButton color="danger" class="text-white mt-3 fs-8 ms-2 delete-form-btn" type="button" @click="handleShowDeleteModal"><CIcon icon="cilClearAll" /> Delete Branch </CButton>        
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
  import { getBranch, updateBranch, getProperties, deleteBranch } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const pageHeading = ref('');
  const pageDescription = ref('')
  const pageLoading = ref(true)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)
  const propertiesData1 = ref([])

  const route = useRoute()
  const router = useRouter()
  const branchId = route.params.id
  const { showToast } = toastNotifications()

  const { data: branchData, execute: execute1 } = useApi(getBranch, false)
  const { data: propertiesData, execute: execute2 } = useApi(getProperties, false)
  const { loading: btnLoading, execute } = useApi(updateBranch, false)
  const { execute: execute3 } = useApi(deleteBranch, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [branchId] })
    await execute2({ queryParameters: { paginate: false } })
    propertiesData1.value = propertiesData.value.data && Object.keys(propertiesData.value.data).length > 0 
      ? Object.values(propertiesData.value.data) : propertiesData.value.data  // non-paginated data
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
    associated_property_id: yup
          .string()
          .notRequired(),
  }))

  const { handleSubmit, isSubmitting, setFieldValue } = useForm({
    validationSchema: schema
  })

  const { 
    value: name, 
    errorMessage: nameError,
    validate: nameValidate,
    meta: nameMeta
  } = useField('name');

  const { 
    value: associated_property_id, 
    errorMessage: associatedPropertyIdError,
    validate: associatedPropertyIdValidate,
    meta: associatedPropertyIdMeta
  } = useField('associated_property_id');

  function setupPageFieldsData(){
    // set page heading data
    pageHeading.value = branchData.value.name
    pageDescription.value = [branchData.value.address, branchData.value.address_2, branchData.value.city, branchData.value.state, branchData.value.postal_code]
        .filter(Boolean)
        .join(', ')

    // set form data
    setFieldValue('name', branchData.value.name)
    setFieldValue('address', branchData.value.address)
    setFieldValue('address_2', branchData.value.address_2)
    setFieldValue('city', branchData.value.city)
    setFieldValue('state', branchData.value.state)
    setFieldValue('postal_code', branchData.value.postal_code)
    setFieldValue('country', branchData.value.country)
    setFieldValue('associated_property_id', branchData.value.associated_property_id)
  }

  function handleShowDeleteModal() {
     showDeleteModal.value = true
  }

  const submitUpdateBranch = handleSubmit(async (formData) => {
    const response = await execute({ pathParams: [branchId], payload: formData})

    if(response.success === true){
      showToast('success', 'Branch updated successfully!')
    } 
  })

   async function handleDelete(){
    deleteBtnLoading.value = true
    const response = await execute3({ pathParams: [branchId]})

    if(response.success === true){
      showToast('success', 'Branch deleted successfully!')
      router.push({ name: 'realtor.branches' })
    } else{
        deleteBtnLoading.value = false
        showDeleteModal.value = false
        showToast('error', 'Oops! Something went wrong!')
    }
  }
</script>

<style scoped>
  .update-branch-form-container form{
    width: 75%;
  }

  @media (max-width: 480px) {
    .update-branch-form-container form{
      width: 100%;
    }

    .update-branch-form-container form .delete-form-btn{
      margin-left: 0px !important;
      margin-top: 10px !important;
    }
    
    .update-branch-form-container form .form-buttons-row {
      display: flex;
      flex-direction: column;
    }
  }
</style>