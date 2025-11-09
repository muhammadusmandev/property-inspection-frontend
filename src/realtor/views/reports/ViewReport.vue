<template>
  <div class="add-report-form-container">
    <PageBodyHeader
      :heading="pageHeading"
      description="Manage your report including adding more inspection areas and defects"
    />
    <CRow class="mt-4">
      <div class="pb-4 col-6">
        <CButton class="px-4 self-bg-primary self-color-tertiary fs-6" @click="visibleAddNewArea()">
          <CIcon icon="cil-plus" /> Add New Inpsection Area
        </CButton>
      </div>
      <h4 class="mb-3 text-self-primary">Inspection Areas</h4>

      <CAccordion v-if="reportData?.areas.length > 0">
        <CAccordionItem
          v-for="area in reportData.areas"
          :key="area.id"
          :item-title="area.name"
          class="mb-3"
        >
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">{{ area.name }}</h5>

            <CDropdown variant="link" class="p-0">
              <CDropdownToggle class="text-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <circle cx="2" cy="8" r="2"/>
                  <circle cx="8" cy="8" r="2"/>
                  <circle cx="14" cy="8" r="2"/>
                </svg>
              </CDropdownToggle>
              <CDropdownMenu placement="bottom-end">
                <CDropdownItem @click="handleShowUpdateModal(area.id)">Edit</CDropdownItem>
                <CDropdownItem @click="handleShowDeleteModal(area.id)">Delete</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
          <CTable bordered hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style="width: 15%;">Name</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%;">Condition</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%;">Cleanliness</CTableHeaderCell>
                <CTableHeaderCell style="width: 25%;">Description</CTableHeaderCell>
                <CTableHeaderCell style="width: 40%;">Items</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell style="width: 15%;">
                  General Overview
                </CTableDataCell>
                <CTableDataCell style="width: 10%;">
                  <CBadge class="text-capitalize px-4 py-2" style="border-radius: 25px" :color="getStatusColor(area.condition)">
                    {{ area.condition }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell style="width: 10%;">
                  <CBadge class="text-capitalize px-4 py-2" style="border-radius: 25px" :color="getStatusColor(area.cleanliness)">
                    {{ area.cleanliness }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell style="width: 25%;">{{ area.description || '-' }}</CTableDataCell>
                <CTableDataCell style="width: 40%;">
                  {{ area.items.map(item => item.name).join(', ') }}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CAccordionItem>
      </CAccordion>
    </CRow>
  </div>
  <AddReportInspectionArea v-model:visibility="showAddNewArea" />
  <UpdateReportInspectionArea v-model:visibility="showUpdateArea" :areaId="updateAreaId" />
  <DeleteWarningModal v-model:visibility="showDeleteModal" :btnLoading="deleteBtnLoading" @confirmedDelete="handleDeleteArea" />
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { CAccordion, CAccordionItem, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CBadge } from "@coreui/vue";
  import { toTypedSchema } from '@vee-validate/yup'
  import { useRoute, useRouter } from 'vue-router'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import AddReportInspectionArea from '@/components/Modals/AddReportInspectionArea.vue'
  import UpdateReportInspectionArea from '@/components/Modals/UpdateReportInspectionArea.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { FullPageSpinnerLoader } from '@/components/General/Loader.vue'
  import DeleteWarningModal from '@/components/Modals/DeleteWarningModal.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { getReport, updateReport, deleteReportInspectionArea } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const pageHeading = ref('')
  const showAddNewArea = ref(false)
  const showUpdateArea = ref(false)
  const updateAreaId = ref(0)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)
  const deleteAreaId = ref(null)
  const route = useRoute()
  const router = useRouter()
  const reportId = route.params.id
  const { showToast } = toastNotifications()

  const { data: reportData, execute: execute1 } = useApi(getReport, false)
  const { loading: btnLoading, execute } = useApi(updateReport, false)
  const { execute: execute2 } = useApi(deleteReportInspectionArea, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
    setupPageFieldsData();
  })

  const schema = toTypedSchema( yup.object({
    
  }))

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema
  })

  function setupPageFieldsData(){
    pageHeading.value = reportData.value.title + ' - ' + reportData.value.property.name
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case "good":
        return "success";
      case "excellent":
        return "success";
      case "unacceptable":
        return "danger";
      case "fair":
        return "warning";
      default:
        return "secondary";
    }
  }

  function handleShowUpdateModal(areaId) {
    showUpdateArea.value = true
    updateAreaId.value = areaId
  }

  function handleShowDeleteModal(areaId) {
    deleteAreaId.value = areaId
    showDeleteModal.value = true
  }

  function visibleAddNewArea() {
    showAddNewArea.value = true
  }

  async function handleDeleteArea(){
    deleteBtnLoading.value = true
    const response = await execute2({ pathParams: [deleteAreaId.value]})

    if(response.success === true){
      showToast('success', 'Inspection area deleted successfully! Wait redirecting...')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else{
      deleteAreaId.value = null
      deleteBtnLoading.value = false
      showToast('error', 'Oops! Something went wrong!')
    }
  }
</script>

<style scoped>
  .accordion {
    border: none !important
  }

  .accordion-item {
    border: none !important
  }

  .table th{
    font-weight: 600;
    color: #4f4f4f;
    font-size: 0.95rem;
  }
</style>