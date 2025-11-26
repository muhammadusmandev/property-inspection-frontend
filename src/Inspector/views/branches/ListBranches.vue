<template>
  <div class="datatable-container">
      <div class="datatable-header-top row align-items-center justify-between">
          <div class="page-heading col-md-6">
            <h2>Branches</h2>
            <p>Full control, monitor and manage all your branches in one place</p>
          </div>
          <div class="text-end pb-4 col-md-6 btns-row">
            <CButton class="px-4 self-bg-primary self-color-tertiary fs-8" as="a" href="/inspector/branches/add_branch">
              <CIcon icon="cil-plus" /> Add New Branch
            </CButton>
            <CButton class="ms-2 px-4 self-bg-light-dark self-color-tertiary fs-8 refresh-btn" @click="refreshDT"><CIcon icon="cil-reload" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Refreshing...' : 'Refresh' }} </CButton>
          </div>
      </div>

      <div class="px-3 mb-4 mt-3 datatable-header-search">
        <CForm class="row align-items-center justify-between" @submit.prevent="searchByColumnName">
          <div class="col-md-9">
              <div class="d-flex search-columns-inputs gap-4 mt-0">
                <CCol md="7">
                  <CFormLabel :for="searchByColumn" class="text-start mb-1 form-label-required">Search Branch</CFormLabel>
                  <CInputGroup class="mb-3">
                      <CInputGroupText>
                      <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                          placeholder="Western side house..."
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
                          <option value="address">Address</option>
                          <option value="postal_code">Postal Code</option>
                          <option value="country">Country</option>
                          <option value="properties.name">Property Name</option>
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
              <CIcon icon="cil-zoom" v-if="!btnLoading1" /> <ButtonSpinner v-if="btnLoading1" size="small" bgColor="#000000" /> {{ btnLoading1 ? 'Searching...' : 'Search Branch' }} 
            </CButton>
          </div>
        </CForm>
      </div>
      <DataTable 
          :value="branches" 
          :paginator="true"
          :rows="perPage"
          dataKey="id"
          :lazy="true"
          :loading="loading"
          @page="loadLazyBranches($event)"
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
          <Column field="address" header="Address" style="height: 44px">
          </Column>
          <Column field="city" header="City" style="height: 44px">
          </Column>
          <Column field="postal_code" header="Postal Code" style="height: 44px">
          </Column>
          <Column field="country" header="Country" style="height: 44px">
          </Column>
          <Column header="Property Name" style="height: 44px">
            <template #body="{ data }">
              {{ data.property?.name ?? 'Not Associated' }}
            </template>
          </Column>
          <Column header="Action" style="height: 44px">
            <template #body="{ data }">
              <div class="d-flex gap-1">
                <CButton class="badge bg-dark" as="a" :href="`/inspector/branches/branch/${data.id}`"><CIcon icon="cil-pen" /></CButton>              
              </div>
            </template>
          </Column>
      </DataTable>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, watch } from 'vue';
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { useApi } from '@/composables/useApi'
  import { getInspectorBranches } from '@/services/api'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'

  const perPage = ref(10)
  const totalRecords = ref(0)
  const branches = ref([])
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

  const { loading, data, execute } = useApi(getInspectorBranches, false)

  onBeforeMount(async () => {
    await loadLazyBranches({ first: 0, rows: perPage.value })
  })

  async function loadLazyBranches(event, queryParams = {}){
    const { first, rows } = event;
    const currentPage = first / rows + 1;

    const queryParameters = {page: currentPage, perPage: rows}
    Object.assign(queryParameters, queryParams) // adding extra query params

    const response = await execute({ queryParameters: queryParameters})
    
    branches.value = response.data.data
    totalRecords.value = response.data.meta.total
  }

  const searchByColumnName = handleSubmit(async (formData) => {
    btnLoading1.value = true
    await loadLazyBranches(
      {first: 0, rows: perPage.value},    // event reset to default
      {columnQuery: formData.searchByColumn, columnName: formData.columnName}  // query params
    )
    btnLoading1.value = false
  })

  async function refreshDT(){
    btnLoading.value = true
    resetForm()
    await loadLazyBranches(
      {first: 0, rows: perPage.value}
    )
    btnLoading.value = false
  }
  

</script>
