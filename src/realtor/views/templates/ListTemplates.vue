<template>
  <div class="datatable-container">
      <div class="row align-items-center justify-between">
          <div class="page-heading col-6">
            <h2>Templates</h2>
            <p>Full control and manage all your templates in one place</p>
          </div>
          <div class="text-end pb-4 col-6">
            <CButton class="px-4 self-bg-primary self-color-tertiary fs-6" @click="visibleAddTemplate()">
              <CIcon icon="cil-plus" /> Add New Template
            </CButton>
            <CButton class="ms-2 px-4 self-bg-light-dark self-color-tertiary fs-6" @click="refreshDT"><CIcon icon="cil-reload" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Refreshing...' : 'Refresh' }} </CButton>
          </div>
      </div>

      <div class="px-3 mb-4 mt-3 datatable-header-search">
        <CForm class="row align-items-center justify-between" @submit.prevent="searchByColumnName">
          <div class="col-9">
              <div class="d-flex gap-4 mt-0">
                <CCol xs="7">
                  <CFormLabel :for="searchByColumn" class="text-start mb-1 form-label-required">Search Template Name</CFormLabel>
                  <CInputGroup class="mb-3">
                      <CInputGroupText>
                      <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                          placeholder="House..."
                          type="text"
                          v-model="searchByColumn"
                          @blur="searchByColumnMeta.touched = true; searchByColumnValidate()"
                      />
                  </CInputGroup>
                  <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="searchByColumnMeta.touched && searchByColumnError">
                    <span>* {{ searchByColumnError }}</span>
                  </div>
                </CCol> 
                <CCol xs="5">
                  <CFormLabel :for="columnName" class="text-start mb-1 form-label-required">Search by Column name</CFormLabel>
                  <CInputGroup class="mb-3">
                      <CInputGroupText>
                      <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormSelect
                          v-model="columnName"
                          @blur="columnNameMeta.touched = true; columnNameValidate()"
                      >
                          <option value="">Choose...</option>
                          <option value="name">Name</option>
                      </CFormSelect>
                  </CInputGroup>
                  <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="columnNameMeta.touched && columnNameError">
                    <span>* {{ columnNameError }}</span>
                  </div>
                </CCol> 
              </div>
          </div>
          <div class="text-end col-3">
            <CButton class="px-4 self-bg-light-dark self-color-tertiary fs-6" type="submit">
              <CIcon icon="cil-zoom" v-if="!btnLoading1" /> <ButtonSpinner v-if="btnLoading1" size="small" bgColor="#000000" /> {{ btnLoading1 ? 'Searching...' : 'Search Template' }} 
            </CButton>
          </div>
        </CForm>
      </div>
      <DataTable 
          :value="templates" 
          :paginator="true"
          :rows="perPage"
          dataKey="id"
          :lazy="true"
          :loading="loading"
          @page="loadLazyTemplates($event)"
          :totalRecords="totalRecords"
          tableStyle="min-width: 50rem"
          ref="dt"
        >
          <template #paginatorcontainer="{ first, last, pageCount, page, prevPageCallback, nextPageCallback, totalRecords }">
            <div class="row items-center gap-4 py-1 px-2 justify-content-between"></div>
            <div class="row align-items-baseline gap-2 py-0 px-2 justify-content-between">
              <CButton @click="prevPageCallback" :disabled="page === 0" id="pagination-item-prev" class="px-4 self-bg-light-dark self-color-tertiary fs-6"><CIcon icon="cilCaretLeft" />Prev</CButton>
              <div class="text-color font-medium" id="pagination-item-data">
                  <span class="hidden sm:block">Showing {{ first }} to {{ last }} of {{ totalRecords }}</span>
              </div>
              <CButton @click="nextPageCallback" :disabled="page === pageCount - 1" id="pagination-item-next" class="px-4 self-bg-light-dark self-color-tertiary fs-6">Next<CIcon icon="cilCaretRight" /></CButton>
            </div>
          </template>
          <Column header="#" headerStyle="width:3rem" style="height: 44px">
              <template #body="slotProps">
                  {{ slotProps.index + 1 }}
              </template>
          </Column>
          <Column field="name" header="Name" style="height: 44px">
          </Column>
          <Column header="Areas" style="height: 44px">
            <template #body="{ data }">
              {{ data.areas?.length > 0 ? showAreas(data.areas) : 'No Areas' }}
            </template>
          </Column>
          <Column header="Status" style="height: 44px">
            <template #body="{ data }">
              <span class="badge bg-info">{{ data.is_default == 1 ? 'Default' : 'Added By You' }}</span>
            </template>
          </Column>
          <Column header="Action" style="height: 44px">
            <template #body="{ data }">
              <div class="d-flex gap-1">
                <span class="badge bg-dark" v-if="data.is_default == 0"><CIcon icon="cil-pen" /></span>
                <span class="badge bg-danger" v-if="data.is_default == 0" @click="handleShowDeleteModal(data.id)"><CIcon icon="cil-x" /></span>
              </div>
            </template>
          </Column>
      </DataTable>
  </div>
  <AddTemplate v-model:visibility="showAddTemplate" />
  <DeleteWarningModal v-model:visibility="showDeleteModal" :btnLoading="deleteBtnLoading" @confirmedDelete="handleDeleteTemplate" />
</template>

<script setup>
  import { ref, onBeforeMount, watch } from 'vue';
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { useApi } from '@/composables/useApi'
  import AddTemplate from '@/components/Modals/AddTemplate.vue'
  import DeleteWarningModal from '@/components/Modals/DeleteWarningModal.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { getTemplates, deleteTemplate } from '@/services/api'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'

  const perPage = ref(20)
  const totalRecords = ref(0)
  const templates = ref([])
  const btnLoading = ref(false)
  const btnLoading1 = ref(false)
  const showAddTemplate = ref(false)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)
  const deleteTemplateId = ref(null)
  const { showToast } = toastNotifications()

  const schema = toTypedSchema( yup.object({
    searchByColumn: yup
          .string()
          .required('Search query required'),
    columnName: yup
          .string()
          .required('Select Column Name'),
  }))

  const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: schema
  })
  
  const { 
    value: searchByColumn, 
    errorMessage: searchByColumnError,
    validate: searchByColumnValidate,
    meta: searchByColumnMeta
  } = useField('searchByColumn');

  const { 
    value: columnName, 
    errorMessage: columnNameError,
    validate: columnNameValidate,
    meta: columnNameMeta
  } = useField('columnName');

  const { loading, data, execute } = useApi(getTemplates, false)
  const { execute: execute1 } = useApi(deleteTemplate, false)

  onBeforeMount(async () => {
    await loadLazyTemplates({ first: 0, rows: perPage.value })
  })

  async function loadLazyTemplates(event, queryParams = {}){
    const { first, rows } = event;
    const currentPage = first / rows + 1;

    const queryParameters = {page: currentPage, perPage: rows}
    Object.assign(queryParameters, queryParams) // adding extra query params

    const response = await execute({ queryParameters: queryParameters})
    
    templates.value = response.data.data
    totalRecords.value = response.data.meta.total
  }

  const searchByColumnName = handleSubmit(async (formData) => {
    btnLoading1.value = true
    await loadLazyTemplates(
      {first: 0, rows: perPage.value},    // event reset to default
      {columnQuery: formData.searchByColumn, columnName: formData.columnName}  // query params
    )
    btnLoading1.value = false
  })

  async function refreshDT(){
    btnLoading.value = true
    resetForm()
    await loadLazyTemplates(
      {first: 0, rows: perPage.value}
    )
    btnLoading.value = false
  }
  
  function showAreas(data){
    return data.map(area => area.name).join(', ');
  }

  function visibleAddTemplate() {
    showAddTemplate.value = true
  }

  function handleShowDeleteModal(templateId) {
    deleteTemplateId.value = templateId
    showDeleteModal.value = true
  }

  async function handleDeleteTemplate(){
    deleteBtnLoading.value = true
    const response = await execute1({ pathParams: [deleteTemplateId.value]})

    if(response.success === true){
      showToast('success', 'Template deleted successfully! Wait redirecting...')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else{
      deleteTemplateId.value = null
      deleteBtnLoading.value = false
      showToast('error', 'Oops! Something went wrong!')
    }
  }
</script>

<style scoped>
    .page-heading h2{
        color: #4b4949;
        font-weight: 700;
        font-size: 2.3rem;
    }

    .page-heading p{
        color: #9b9b9b;
        font-size: 1.08rem;
    }

    .p-paginator #pagination-item-prev,
    .p-paginator #pagination-item-data,
    .p-paginator #pagination-item-next{
      max-width: fit-content !important;
    }

    .datatable-header-search{
      background-color: #f1f4f9;
      padding-top: 20px;
      padding-bottom: 20px;
      border-radius: 10px;
      border: 1px solid #e9e7e7;
      box-shadow: 0 10px 12px 0 rgba(218, 218, 253, 0.65), 0 2px 5px 0 rgba(206, 206, 238, 0.6);
    }
</style>
