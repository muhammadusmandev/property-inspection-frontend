<template>
    <div  v-if="reportData?.locked_at">
      <div class="d-flex justify-content-between align-items-center mb-4 mt-4 p-4" style="border: 1px solid #e0e0e0">
        <div>
          <h3>Download Report</h3>
          <p class="text-secondary fs-7">Copy your generated pdf report link or directly download from here.</p>
        </div>
      </div>
      
      <div class="mt-5 py-5 px-4 border">
        <CAlert color="info" class="fs-8 py-2 d-inline-block">✓ All steps completed successfully. Your report is ready to download.</CAlert>
        <CCol md="10">
            <CFormLabel :for="downloadLink">Report Download Link</CFormLabel>
            <div class="input-group">
                <span class="input-group-text">
                    <CIcon icon="cil-link" class="text-info" />
                </span>
                <CFormInput 
                    placeholder="Report Download Link"
                    v-model="downloadLink"
                    disabled
                    class="py-2"
                />
                <CButton class="self-bg-primary text-white" @click="copyDownloadLink">
                    <CIcon icon="cil-copy" class="text-white" size="sm" />
                    <span class="ps-2 text-white" style="font-size: 14px"> Copy</span>
                </CButton>
            </div>
        </CCol>

        <div class="button-group mt-5">
          <CButton class="self-bg-primary self-color-tertiary fs-8 px-4 py-2 w-auto" @click="downloadReport" v-if="downloadLink"><CIcon icon="cil-cloud-download" class="text-white" /> Download Report</CButton>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column justify-content-center mt-5 mx-auto" style="width: fit-content" v-else>
      <h3 class="mb-4 self-color-primary">First generate report to Download</h3>
      <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4"  @click="handleGoToStep('generate')">
        <CIcon icon="cil-reload" /> Generate Report
      </CButton>
    </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { 
    getReport
  } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const downloadLink = ref('')
  const route = useRoute()
  const reportId = route.params.id
  const emit = defineEmits(['goToStep'])
  const { showToast } = toastNotifications()

  const { data: reportData, execute: execute1 } = useApi(getReport, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
    downloadLink.value = reportData.value.download_link
  })

  const handleGoToStep = (step) => {
    emit('goToStep', step)
  }

  const copyDownloadLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadLink.value)
      showToast('success', 'Download Link copied!')
    } catch (err) {
      showToast('error', 'Failed to copy download link!')
    }
  }

  const downloadReport = async() => {
    window.location.href = downloadLink.value;

  }
</script>

<style scoped>

</style>