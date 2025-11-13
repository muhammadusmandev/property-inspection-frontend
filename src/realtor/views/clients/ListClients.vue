<template>
  <div class="datatable-container">
      <div class="datatable-header-top row align-items-center justify-between">
          <div class="page-heading col-md-6">
            <h2>Clients / Landlords</h2>
            <p>Full control, monitor and manage all your clients in one place</p>
          </div>
          <div class="text-end pb-4 col-md-6 btns-row">
            <CButton class="px-2 self-bg-primary self-color-tertiary fs-8" as="a" href="/realtor/clients/add_client">
              <CIcon icon="cil-plus" /> Add New Client/Landlord
            </CButton>
            <CButton class="ms-2 px-4 self-bg-light-dark self-color-tertiary fs-8 refresh-btn" @click="refreshDT"><CIcon icon="cil-reload" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Refreshing...' : 'Refresh' }} </CButton>
          </div>
      </div>

      <div class="px-3 mb-4 mt-3 datatable-header-search">
        <CForm class="row align-items-center justify-between" @submit.prevent="searchByColumnName">
          <div class="col-md-9">
              <div class="d-flex search-columns-inputs gap-4 mt-0">
                <CCol md="7">
                  <CFormLabel :for="searchByColumn" class="text-start mb-1 form-label-required">Search Client / Landlord</CFormLabel>
                  <CInputGroup class="mb-3">
                      <CInputGroupText>
                      <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                          placeholder="John Doe..."
                          type="text"
                          v-model="searchByColumn"
                          @blur="searchByColumnMeta.touched = true; searchByColumnValidate()"
                      />
                  </CInputGroup>
                  <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="searchByColumnMeta.touched && searchByColumnError">
                    <span>* {{ searchByColumnError }}</span>
                  </div>
                </CCol> 
                <CCol md="5">
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
                          <option value="email">Email</option>
                      </CFormSelect>
                  </CInputGroup>
                  <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="columnNameMeta.touched && columnNameError">
                    <span>* {{ columnNameError }}</span>
                  </div>
                </CCol> 
              </div>
          </div>
          <div class="text-end col-md-3 search-btn">
            <CButton class="px-4 self-bg-light-dark self-color-tertiary fs-8" type="submit">
              <CIcon icon="cil-zoom" v-if="!btnLoading1" /> <ButtonSpinner v-if="btnLoading1" size="small" bgColor="#000000" /> {{ btnLoading1 ? 'Searching...' : 'Search Client' }} 
            </CButton>
          </div>
        </CForm>
      </div>
      <DataTable 
          :value="clients" 
          :paginator="true"
          :rows="perPage"
          dataKey="id"
          :lazy="true"
          :loading="loading"
          @page="loadLazyClients($event)"
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
          <Column field="email" header="Email Address" style="height: 44px">
          </Column>
          <Column field="phone_number" header="Phone No." style="height: 44px">
          </Column>
          <Column field="gender" header="Gender" style="height: 44px">
          </Column>
          <Column header="Action" style="height: 44px">
            <template #body="{ data }">
              <div class="d-flex gap-1">
                <CButton class="badge bg-dark" as="a" :href="`/realtor/clients/client/${data.id}`"><CIcon icon="cil-pen" /></CButton>              
              </div>
            </template>
          </Column>
      </DataTable>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue';
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { useApi } from '@/composables/useApi'
  import { getRealtorClients } from '@/services/api'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'

  const perPage = ref(10)
  const totalRecords = ref(0)
  const clients = ref([])
  const btnLoading = ref(false)
  const btnLoading1 = ref(false)

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

  const { loading, data, execute } = useApi(getRealtorClients, false)

  onBeforeMount(async () => {
    await loadLazyClients({ first: 0, rows: perPage.value })
  })

  async function loadLazyClients(event, queryParams = {}){
    const { first, rows } = event;
    const currentPage = first / rows + 1;

    const queryParameters = {page: currentPage, perPage: rows}
    Object.assign(queryParameters, queryParams) // adding extra query params

    const response = await execute({ queryParameters: queryParameters})
    
    clients.value = response.data.data
    totalRecords.value = response.data.meta.total
  }

  const searchByColumnName = handleSubmit(async (formData) => {
    btnLoading1.value = true
    await loadLazyClients(
      {first: 0, rows: perPage.value},    // event reset to default
      {columnQuery: formData.searchByColumn, columnName: formData.columnName}  // query params
    )
    btnLoading1.value = false
  })

  async function refreshDT(){
    btnLoading.value = true
    resetForm()
    await loadLazyClients(
      {first: 0, rows: perPage.value}
    )
    btnLoading.value = false
  }
  
</script>
