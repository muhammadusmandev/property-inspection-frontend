<template>
  <div class="add-report-form-container">
    <PageBodyHeader
      :heading="pageHeading"
      description="Manage your report including adding more inspection areas and defects"
    />
    <div class="wizard-container">
      <!-- Main Wizard Area -->
      <div>
        <!-- Header with Step Indicators -->
        <div class="wizard-header">
          <div class="steps-container">
            <button
              v-for="(step, i) in steps"
              :key="i"
              class="step-btn"
              :class="{
                active: currentStep === step.id,
                completed: currentStep > step.id
              }"
              @click="goToStep(step.id)"
            >
              {{ step.id }}
            </button>
          </div>
          <div class="step-labels">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="step-label"
              :class="{ active: currentStep === step.id }"
            >
              {{ step.label }}
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="wizard-content">
          <!-- Step 1 -->
          <div v-if="currentStep === 1" class="content-step active">
            
            <CRow v-if="!reportData?.locked_at">
              <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
                <div>
                  <h3>Inspection Areas</h3>
                  <p class="text-secondary fs-7">Manage selected template areas and custom inspection areas</p>
                </div>
                <div class="my-3 text-end">
                  <span class="d-inline-block me-3 fs-8 text-secondary">Proceed to Next Step <CIcon icon="cil-arrow-right" /> </span>
                  <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto"  @click="goToStep(2)">
                    <CIcon icon="cil-pen-alt" /> Checklist
                  </CButton>
                </div>
              </div>
              <div class="mb-4">
                <CButton class="px-3 py-2 bg-dark text-white" style="border-radius: 25px; font-size: 13px;" @click="visibleAddNewArea()">
                  <CIcon icon="cil-plus" size="sm" /> Add Inpsection Area
                </CButton>
              </div>
              
              <CAccordion v-if="reportData?.areas.length > 0">
                <CAccordionItem
                  v-for="area in reportData.areas"
                  :key="area.id"
                  :item-title="area.name"
                  class="mb-3"
                >
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">{{ area.name }}</h5>

                    <div class="d-flex gap-2 align-items-center">
                      <CBadge class="px-3 py-2 h-100" v-if="refAreaIdForImages === area.id && selectedImages.length > 0" style="border-radius: 25px; cursor: pointer" color="info" @click="uploadInpsectionAreaPhotos">
                        <CIcon icon="cil-cloud-upload" v-if="!uploadBtnLoading" /> <ButtonSpinner v-if="uploadBtnLoading" size="small" bgColor="#000000" /> {{ uploadBtnLoading ? 'Uploading...' : 'Upload ' + selectedImages.length + ' Selected Photos' }} 
                      </CBadge>
                      <CBadge class="px-3 py-2 h-100" v-else style="border-radius: 25px; cursor: pointer" color="info" @click="visibleShowImagesUpload(area.id)">
                        <CIcon icon="cil-camera" /> Attach Photos
                      </CBadge>
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
                  </div>
                  <CTable bordered hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style="width: 10%;">Quality</CTableHeaderCell>
                        <CTableHeaderCell style="width: 25%;">Description</CTableHeaderCell>
                        <CTableHeaderCell style="width: 30%;">Photos</CTableHeaderCell>
                        <CTableHeaderCell style="width: 35%;">Items</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell style="width: 10%;">
                          <CBadge class="text-capitalize px-3 py-2" style="border-radius: 25px" :color="getStatusColor(area.condition)">
                            Condition - {{ area.condition }}
                          </CBadge>
                          <CBadge class="text-capitalize px-3 py-2 mt-1" style="border-radius: 25px" :color="getStatusColor(area.condition)">
                            Cleanliness - {{ area.cleanliness }}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell style="width: 25%;">{{ area.description || '-' }}</CTableDataCell>
                        <CTableDataCell style="width: 30%;" class="fs-8 text-secondary">
                          <div class="d-flex flex-wrap gap-2" v-if="area.media.length">
                            <div class="position-relative" v-for="(image, index) in area.media">
                              <CImage class="area-img" :src="createServerImageURL(image.thumbnail_path ? image.thumbnail_path : image.file_path)" alt="Area Image" width="50" height="59" />
                              <button class="remove-selected-img bg-dark text-white border-0 position-absolute" @click="deleteAreaImg(image.id)">×</button>
                            </div>
                          </div>
                          <p class="fs-8" v-else>
                            No Image Uploaded Yet
                          </p>
                        </CTableDataCell>
                        <CTableDataCell style="width: 35%;" class="fs-8 text-secondary">
                          {{ area.items.map(item => item.name).join(', ') }}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CAccordionItem>
              </CAccordion>
            </CRow>
            <div class="mt-4" v-else>
              <h3 class="mb-4 self-color-primary"><CIcon icon="cil-lock-locked" size="xl" /> Report Locked</h3>
              <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4"  @click="goToStep(4)">
                <CIcon icon="cil-cloud-download" /> Download Report
              </CButton>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-if="currentStep === 2" class="content-step active">
            <div v-if="!reportData?.locked_at">
              <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
                <div>
                  <h3>Inspection Checklist</h3>
                  <p class="text-secondary fs-7">Manage inspection checklist what item need to add</p>
                </div>
                <div class="my-3 text-end">
                  <span class="d-inline-block me-3 fs-8 text-secondary">Proceed to Next Step <CIcon icon="cil-arrow-right" /> </span>
                  <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto"  @click="goToStep(3)">
                    <CIcon icon="cil-pen-alt" /> Sign Report
                  </CButton>
                </div>
              </div>

              <!-- Checklist Items -->
              <div class="mb-4 border py-3 px-4" v-for="(group, type) in groupedChecklist" :key="type">
                <h5>{{ type }}</h5>
                <div class="d-flex justify-content-between align-items-center py-1" v-for="item in group" :key="item.label">
                  <span class="fs-8 text-secondary">{{ item.label }}</span>
                  <CFormSwitch v-model="item.checked" @change="handleUpdateChecklistItem(item)"  />
                </div>
              </div>
            </div>
            <div class="mt-4" v-else>
              <h3 class="mb-4 self-color-primary"><CIcon icon="cil-lock-locked" size="xl" /> Report Locked</h3>
              <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4"  @click="goToStep(4)">
                <CIcon icon="cil-cloud-download" /> Download Report
              </CButton>
            </div>
          </div>

          <!-- Step 3 -->
          <div v-if="currentStep === 3" class="content-step active">
            <div v-if="!reportData?.locked_at">
              <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
                <div>
                  <h3>Sign Report</h3>
                  <p>Sign your report and lock it for download ready</p>
                </div>
                <div class="my-3 text-end">
                  <span class="d-inline-block me-3 fs-8 text-secondary">Proceed to Next Step <CIcon icon="cil-arrow-right" /> </span>
                  <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto"  @click="goToStep(4)">
                    <CIcon icon="cil-pen-alt" /> Download Report
                  </CButton>
                </div>
              </div>
              <div class="mt-5 py-5 border">
                <CCol xs="12">
                    <p class="mt-5 sign-important-note mb-0 text-center"><span class="fw-bold">Important Note:</span> I hereby acknowledge that submitting my signature will close this report, making it read-only and unchangeable.</p>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 fs-7 mt-2 sign-certify-text mx-auto">I certify that the observations and remarks in this report are accurate to the best of my knowledge and reflect my honest evaluation of the property’s condition.</p>
                    <div class="mx-0 px-4 w-75 mx-auto">
                        <CFormInput 
                            :placeholder="`Type Signature '${authUserName}' here`" 
                            v-model="signatureName"
                            class="fs-8 py-2"
                            required
                        />
                        <div class="flex form-field-error d-inline-block mt-2" v-if="signErrorMessage">
                          <span>* {{ signErrorMessage }}</span>
                        </div>
                    </div>
                </CCol>
                <div class="d-grid mt-4 mb-3">
                    <CButton color="info" class="px-4 py-2 text-white w-25 fs-8 mx-auto mt-1" @click="handleSignReport"><CIcon icon="cilPenAlt" v-if="!signBtnLoading" /> <ButtonSpinner v-if="signBtnLoading" size="small" bgColor="#000000" />{{ signBtnLoading ? 'Signing...' : 'Sign Report' }}</CButton>
                    <CButton color="dark" class="px-4 py-2 w-25 fs-8 mx-auto mt-2" @click="goToStep(2)"><CIcon icon="cil-arrow-left" /> Go Back</CButton>
                </div>
              </div>
            </div>
            <div class="mt-4" v-else>
              <h3 class="mb-4 self-color-primary"><CIcon icon="cil-lock-locked" size="xl" /> Report Locked</h3>
              <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4"  @click="goToStep(4)">
                <CIcon icon="cil-cloud-download" /> Download Report
              </CButton>
            </div>
          </div>

          <!-- Step 4 -->
          <div v-if="currentStep === 4" class="content-step active">
            <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
              <div>
                <h3>Download Report</h3>
                <p>Download your report!</p>
              </div>
              <div class="my-3 text-end">
                <span class="d-inline-block me-3 fs-8 text-secondary">Proceed to Previous Step <CIcon icon="cil-arrow-right" /> </span>
                <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto"  @click="goToStep(3)">
                  <CIcon icon="cil-pen-alt" /> Sign Report
                </CButton>
              </div>
            </div>
            
            <div style="padding: 15px; background: #d4edda; border-radius: 4px; color: #155724; margin: 15px 0; font-size: 13px;">
              ✓ All steps completed successfully
            </div>
            <div class="button-group">
              <button class="btn btn-primary">Download Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddReportInspectionArea v-model:visibility="showAddNewArea" />
  <UpdateReportInspectionArea v-model:visibility="showUpdateArea" :areaId="updateAreaId" />
  <DeleteWarningModal v-model:visibility="showDeleteModal" :btnLoading="deleteBtnLoading" @confirmedDelete="handleDeleteArea" />
  <MultipleImagesSelector v-model:visibility="showImagesUpload" @images-selected="onImagesSelected" :refItemId="refAreaIdForImages" :resetImages="resetImages" />
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { CFormSwitch } from '@coreui/vue'
  import PageBodyHeader from '@/components/General/PageBodyHeader.vue'
  import AddReportInspectionArea from '@/components/Modals/AddReportInspectionArea.vue'
  import UpdateReportInspectionArea from '@/components/Modals/UpdateReportInspectionArea.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { FullPageSpinnerLoader } from '@/components/General/Loader.vue'
  import MultipleImagesSelector from '@/components/Modals/MultipleImagesSelector.vue'
  import DeleteWarningModal from '@/components/Modals/DeleteWarningModal.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { 
    getReport, 
    updateReport, 
    deleteReportInspectionArea, 
    uploadReportInspectionAreaImages, 
    deleteMedia, 
    updateChecklistItem, 
    markReportLocked 
  } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const pageHeading = ref('')
  const showAddNewArea = ref(false)
  const showUpdateArea = ref(false)
  const showImagesUpload = ref(false)
  const updateAreaId = ref(0)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)
  const uploadBtnLoading = ref(false)
  const deleteAreaId = ref(null)
  const selectedImages = ref([])
  const resetImages = ref(0)
  const refAreaIdForImages = ref('')
  const signatureName = ref('')
  const signErrorMessage = ref('')
  const signBtnLoading = ref(false)
  const checklist = ref('')
  const route = useRoute()
  const router = useRouter()
  const reportId = route.params.id
  const { showToast } = toastNotifications()
  const authStore = useAuthStore()
  const authUserName = authStore.user.name

  const { data: reportData, execute: execute1 } = useApi(getReport, false)
  const { loading: btnLoading, execute } = useApi(updateReport, false)
  const { execute: execute2 } = useApi(deleteReportInspectionArea, false)
  const { execute: executeUploadImages } = useApi(uploadReportInspectionAreaImages, false)
  const { execute: executeDeleteMedia } = useApi(deleteMedia, false)
  const { execute: executeUpdateChecklist } = useApi(updateChecklistItem, false)
  const { execute: executeLockReport } = useApi(markReportLocked, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
    setupPageFieldsData();
  })

  function setupPageFieldsData(){
    pageHeading.value = reportData.value.title + ' - ' + reportData.value.property.name

    checklist.value = reportData.value.checklist.map(item => ({
      id: item.id,
      label: item.label,
      checked: item.checked,
      type: item.type,
    }))
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

  function visibleShowImagesUpload(areaId) {
    resetImages.value++
    refAreaIdForImages.value = areaId
    selectedImages.value = []
    showImagesUpload.value = true
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

  async function uploadInpsectionAreaPhotos() {
    uploadBtnLoading.value = true

    const formData = new FormData()
    selectedImages.value.forEach(image => {
      formData.append('images[]', image)
    })
    formData.append('area_id', refAreaIdForImages.value)
    
    const response = await executeUploadImages({ payload: formData, config: { isMultipart: true } })

    if(response.success === true){
      showToast('success', 'Inspection area photos uploaded successfully! Wait redirecting...')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else{
      refAreaIdForImages.value = null
      uploadBtnLoading.value = false
      showToast('error', 'Oops! Something went wrong!')
    }
  }

  async function deleteAreaImg(mediaId) {
    const response = await executeDeleteMedia({ pathParams: [mediaId] })

    if(response.success === true){
      showToast('success', 'Inspection area photo deleted successfully! Wait redirecting...')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else{
      showToast('error', 'Oops! Something went wrong!')
    }
  }

  function onImagesSelected({ refId, images }){
    selectedImages.value = images
  }

  const groupedChecklist = computed(() => {
    const groups = {}
    checklist.value.forEach(item => {
      const type = item.type || 'General'
      if (!groups[type]) groups[type] = []
      groups[type].push(item)
    })
    return groups
  })

  async function handleUpdateChecklistItem(item){
    const response = await executeUpdateChecklist({ payload: {report_id: reportId, checklist_id: item.id, checked: !item.checked} })

    if(response.success === true){
      showToast('success', 'Item status changed successfully!')
    } else{
      showToast('error', 'Oops! Something went wrong while changing status!')
    }
  }

  async function handleSignReport(item){
    signBtnLoading.value = true

    if (signatureName.value.trim() === authUserName) {
      signErrorMessage.value = ''
      const response = await executeLockReport({ pathParams: [reportId] })

      if(response.success === true){
        showToast('success', 'Report Locked successfully! Wait Redirecting...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else{
        showToast('error', 'Oops! Something went wrong while locking report!')
        signBtnLoading.value = false
      }
    } else{
      signErrorMessage.value = 'Must add valid signature of account holder name.'
      signBtnLoading.value = false
    }
  }

  const currentStep = ref(1)

  const steps = [
    { id: 1, label: "Inspection Area" },
    { id: 2, label: "Checklist" },
    { id: 3, label: "Sign Report" },
    { id: 4, label: "Download Report" },
  ]

  const goToStep = (step) => {
    currentStep.value = step;
  }

  // Todo: create global helper method
  function createServerImageURL(path){
    return `http://127.0.0.1:8000/storage/` + path;
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

    /* Horizontal Step Indicator */
    .wizard-header {
      background: white;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .steps-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 45px;
    }

    .step-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid #dee2e6;
      background: white;
      color: #6c757d;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
    }

    .step-btn:hover {
      border-color: #0c63e4;
    }

    .step-btn.active {
      background: #02aad3;
      color: white;
      border-color: #02aad3;
      box-shadow: 0 4px 12px rgb(118 118 118 / 30%);
    }

    .step-btn.completed {
      background: #212631;
      color: white;
      border-color: #212631;
    }

    /* Connecting line between steps */
    .steps-container::before {
      content: '';
      position: absolute;
      left: 24px;
      top: 22px;
      width: calc(100% - 48px);
      height: 2px;
      background: #dee2e6;
      z-index: 0;
    }

    .step-btn {
      z-index: 1;
    }

    /* Step Labels */
    .step-labels {
      display: flex;
      gap: 30px;
      margin-top: 12px;
      font-size: 12px;
      color: #6c757d;
    }

    .step-label {
      flex: 0 0 53px;
      text-align: center;
      font-weight: 500;
    }

    .step-btn.active ~ .step-labels .step-label,
    .step-label.active {
      color: #212529;
      font-weight: 600;
    }

    /* Content Area */
    .wizard-content {
      min-height: 300px;
    }

    .content-step {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .content-step.active {
      display: block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Button Group */
    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      justify-content: space-between;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .wizard-container {
        grid-template-columns: 1fr;
      }

      .steps-container {
        flex-wrap: wrap;
      }
    }

    .area-img {
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid #ddd;
    }

    .remove-selected-img {
      top: -5px;
      right: -5px;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      line-height: 10px;
      cursor: pointer;
      font-size: 13px;
    }
</style>