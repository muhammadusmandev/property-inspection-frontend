<template>
    <CRow v-if="!reportData?.locked_at">
        <div class="d-flex justify-content-between align-items-center mb-4 mt-4 p-4" style="border: 1px solid #e0e0e0">
            <div>
                <h3><CIcon icon="cil-room" size="xxl" /> Inspection Areas</h3>
                <p class="text-secondary fs-7">Manage selected template areas and custom inspection areas</p>
            </div>
            <div class="my-3 text-end">
                <CButton class="px-3 py-2 bg-dark text-white" style="border-radius: 25px; font-size: 13px;" @click="visibleAddNewArea()">
                    <CIcon icon="cil-plus" size="sm" /> Add Inpsection Area
                </CButton>
            </div>
        </div>
        
        <CAccordion class="px-0" v-if="reportData?.areas.length > 0">
        <!-- Area -->
        <CAccordionItem
            v-for="area in reportData.areas"
            :key="area.id"
            :item-title="area.name"
            class="mb-3"
        >
            <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">{{ area.name }}</h5>

            <div class="d-flex gap-2 align-items-center">
                <CButton class="px-3 py-1 h-100 text-white" v-if="refAreaIdForImages === area.id && selectedImages.length > 0" style="border-radius: 25px; cursor: pointer; font-size: 0.78rem" color="info" @click="uploadInpsectionAreaPhotos" :disabled="uploadBtnLoading">
                <CIcon icon="cil-cloud-upload" v-if="!uploadBtnLoading" /> <ButtonSpinner v-if="uploadBtnLoading" size="small" bgColor="#000000" /> {{ uploadBtnLoading ? 'Uploading...' : 'Upload ' + selectedImages.length + ' Selected Photos' }} 
                </CButton>
                <CButton class="px-3 py-1 h-100 text-white" v-else style="border-radius: 25px; cursor: pointer; font-size: 0.78rem" color="info" @click="visibleShowImagesUpload(area.id)">
                <CIcon icon="cil-camera" /> Attach Photos
                </CButton>
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
                    <CDropdownItem @click="handleShowDeleteModal(area.id, 'area')">Delete</CDropdownItem>
                </CDropdownMenu>
                </CDropdown>
            </div>
            </div>
            <CTable hover responsive class="mb-3">
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
                    <CBadge class="text-capitalize px-3 py-2" style="border-radius: 25px; font-weight: 300" :color="getStatusColor(area.condition)">
                    Condition - {{ area.condition }}
                    </CBadge>
                    <CBadge class="text-capitalize px-3 py-2 mt-1" style="border-radius: 25px; font-weight: 300" :color="getStatusColor(area.condition)">
                    Cleanliness - {{ area.cleanliness }}
                    </CBadge>
                </CTableDataCell>
                <CTableDataCell style="width: 25%;" class="fs-8 text-secondary">{{ area.description || '-' }}</CTableDataCell>
                <CTableDataCell style="width: 30%;" class="fs-8 text-secondary">
                    <div class="d-flex flex-wrap gap-2" v-if="area.media.length">
                    <div class="position-relative" v-for="(image, index) in area.media">
                        <CImage class="area-img" :src="createServerImageURL(image.thumbnail_path ? image.thumbnail_path : image.file_path)" alt="Area Image" width="50" height="59" />
                        <button class="remove-selected-img bg-dark text-white border-0 position-absolute" @click="deleteImg(image.id, 'area')">×</button>
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

            <!-- Defects -->
            <h6 class="mb-3">
            <CIcon icon="cil-warning" /> Defects
            </h6>
            <CTable v-if="area.defects?.length > 0" hover responsive>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell style="width: 10%;">Category</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%;">Remediation</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%;">Priority</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%;">Item Name</CTableHeaderCell>
                <CTableHeaderCell style="width: 30%;">Comments</CTableHeaderCell>
                <CTableHeaderCell style="width: 30%;">Photos</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%;">Action</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody class="fs-8">
                <CTableRow v-for="(defect, idx) in area.defects">
                <CTableDataCell style="width: 10%;">
                    <span class="text-capitalize text-secondary">
                    {{ defect.defect_type }}
                    </span>
                </CTableDataCell>
                <CTableDataCell style="width: 10%;">
                    <span class="text-capitalize text-secondary">
                    {{ defect.remediation }}
                    </span>
                </CTableDataCell>
                <CTableDataCell style="width: 10%;">
                    <span class="text-capitalize text-secondary">
                    {{ defect.priority }}
                    </span>
                </CTableDataCell>
                <CTableDataCell style="width: 10%;" class="text-secondary">{{ defect.area_item_name || '-' }}</CTableDataCell>
                <CTableDataCell style="width: 25%;" class="text-secondary">
                    {{ defect.comments || '-' }}
                </CTableDataCell>
                <CTableDataCell style="width: 25%;">
                    <div class="d-flex flex-wrap gap-2" v-if="defect.images?.length">
                    <div class="position-relative" v-for="(image, index) in defect.images">
                        <CImage class="area-img" :src="createServerImageURL(image.thumbnail_path ? image.thumbnail_path : image.file_path)" alt="Defect Image" width="50" height="59" />
                        <button class="remove-selected-img bg-dark text-white border-0 position-absolute" @click="deleteImg(image.id, 'defect')">×</button>
                    </div>
                    </div>
                    <p v-else>
                    No Image Uploaded Yet
                    </p>
                </CTableDataCell>
                <CTableDataCell style="width: 10%;" class="fs-8 text-secondary">
                    <span class="badge bg-dark" style="cursor: pointer;" @click="handleShowDefectUpdateModal(defect.id)"><CIcon icon="cil-pen" /></span><br>
                    <span class="badge bg-danger mt-1" style="cursor: pointer;" @click="handleShowDeleteModal(defect.id, 'defect')"><CIcon icon="cil-x" /></span>
                </CTableDataCell>
                </CTableRow>
            </CTableBody>
            </CTable>
            <h5 class="no-defect-added-text text-body-secondary" v-else>
            No Defects Added
            </h5>
            <div class="d-block text-center">
            <CButton color="primary" class="px-4 py-1 self-button mx-auto d-inline-block fs-8" @click="visibleAddAreaDefects(area.id)"> <CIcon icon="cil-warning" /> Add Defect</CButton>
            </div>
            <!-- Defects -->
        </CAccordionItem>
        <!-- Area -->
        </CAccordion>
    </CRow>
    <div class="d-flex flex-column justify-content-center mt-5 mx-auto" style="width: fit-content" v-else>
        <h3 class="mb-4 self-color-primary"><CIcon icon="cil-lock-locked" size="xl" /> Report Locked</h3>
        <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4"  @click="handleGoToStep(4)">
        <CIcon icon="cil-cloud-download" /> Download Report
        </CButton>
    </div>

  <AddReportInspectionArea v-model:visibility="showAddNewArea" />
  <AddReportAreaDefects v-model:visibility="showAddAreaDefects" :areaId="defectAreaId" />
  <UpdateReportInspectionArea v-model:visibility="showUpdateArea" :areaId="updateAreaId" />
  <UpdateReportAreaDefect v-model:visibility="showUpdateAreaDefect" :defectId="updateDefectId" />
  <DeleteWarningModal v-model:visibility="showDeleteModal" :btnLoading="deleteBtnLoading" @confirmedDelete="handleDeleteResource" />
  <MultipleImagesSelector v-model:visibility="showImagesUpload" @images-selected="onImagesSelected" :refItemId="refAreaIdForImages" :resetImages="resetImages" />
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  import AddReportInspectionArea from '@/components/Modals/AddReportInspectionArea.vue'
  import AddReportAreaDefects from '@/components/Modals/AddReportAreaDefects.vue'
  import UpdateReportInspectionArea from '@/components/Modals/UpdateReportInspectionArea.vue'
  import UpdateReportAreaDefect from '@/components/Modals/UpdateReportAreaDefect.vue'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import MultipleImagesSelector from '@/components/Modals/MultipleImagesSelector.vue'
  import DeleteWarningModal from '@/components/Modals/DeleteWarningModal.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { 
    getReport, 
    updateReport, 
    deleteReportInspectionArea, 
    uploadReportInspectionAreaImages, 
    deleteMedia, 
    deleteReportAreaDefect
  } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const showAddNewArea = ref(false)
  const showAddAreaDefects = ref(false)
  const showUpdateArea = ref(false)
  const showUpdateAreaDefect = ref(false)
  const showImagesUpload = ref(false)
  const updateAreaId = ref(0)
  const updateDefectId = ref(0)
  const defectAreaId = ref(0)
  const showDeleteModal = ref(false)
  const deleteBtnLoading = ref(false)
  const uploadBtnLoading = ref(false)
  const deleteAreaId = ref(null)
  const deleteAreaDefectId = ref(null)
  const deleteResource = ref('')
  const selectedImages = ref([])
  const resetImages = ref(0)
  const refAreaIdForImages = ref('')
  const route = useRoute()
  const reportId = route.params.id
  const { showToast } = toastNotifications()
  const emit = defineEmits(['goToStep'])

  const { data: reportData, execute: execute1 } = useApi(getReport, false)
  const { execute: execute2 } = useApi(deleteReportInspectionArea, false)
  const { execute: executeUploadImages } = useApi(uploadReportInspectionAreaImages, false)
  const { execute: executeDeleteMedia } = useApi(deleteMedia, false)
  const { execute: executeDeleteAreaDefect } = useApi(deleteReportAreaDefect, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
  })

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

  function handleShowDefectUpdateModal(defectId) {
    showUpdateAreaDefect.value = true
    updateDefectId.value = defectId
  }

  function handleShowDeleteModal(Id, resource) {
    if(resource === "area"){
      deleteAreaId.value = Id
    } else if(resource === "defect"){
      deleteAreaDefectId.value = Id
    }

    deleteResource.value = resource  // area or defect
    showDeleteModal.value = true
  }

  function visibleAddNewArea() {
    showAddNewArea.value = true
  }

  function visibleAddAreaDefects(areaId) {
    showAddAreaDefects.value = true
    defectAreaId.value = areaId
  }

  function visibleShowImagesUpload(areaId) {
    resetImages.value++
    refAreaIdForImages.value = areaId
    selectedImages.value = []
    showImagesUpload.value = true
  }

  async function handleDeleteResource(){
    if(deleteResource === "area"){
      deleteBtnLoading.value = true
      const response = await execute2({ pathParams: [deleteAreaId.value]})

      if(response.success === true){
        showToast('success', 'Inspection area deleted successfully! Wait redirecting...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else{
        deleteAreaId.value = null
        deleteResource.value = ''
        deleteBtnLoading.value = false
        showToast('error', 'Oops! Something went wrong!')
      }
    } else{
      deleteBtnLoading.value = true
      const response = await executeDeleteAreaDefect({ pathParams: [deleteAreaDefectId.value]})

      if(response.success === true){
        showToast('success', 'Inspection area defect deleted successfully! Wait redirecting...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else{
        deleteAreaDefectId.value = null
        deleteResource.value = ''
        deleteBtnLoading.value = false
        showToast('error', 'Oops! Something went wrong!')
      }
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

  async function deleteImg(mediaId, resource) {
    const response = await executeDeleteMedia({ pathParams: [mediaId] })

    if(response.success === true){
      const msg = (resource === 'area' ? 'Inspection area photo deleted successfully! Wait redirecting...' : 'Inspection area defect photo deleted successfully! Wait redirecting...');
      showToast('success', msg)
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

  const handleGoToStep = (step) => {
    emit('goToStep', step)
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
    border: 1px solid #e7e7e7 !important;
    padding: 12px 20px;
    background: #fbfbfb;
  }

  .table th{
    font-weight: 500;
    color: #5e5e5e;
    font-size: 0.86rem;
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

  .no-defect-added-text{
    text-align: center;
    background: #ffffff;
    padding: 10px;
    font-size: 13px;
  }
</style>