<template>
  <div class="view-report-container">
    <div class="wizard-container">
      <!-- Main Wizard Area -->
      <div>
        <h2 v-if="pageHeading" class="page-heading">{{ pageHeading }}</h2>
        <div class="d-flex report-data mt-4">
          <h6 class="report-date text-secondary"><CIcon icon="cil-calendar" /><span class="text-dark"> Report Date - </span>{{ reportData?.report_date ? localeAwareLongDateFormat(reportData?.report_date) : 'N/A' }}</h6>
          <h6 class="report-type text-secondary"><CIcon icon="cil-tag" /><span class="text-dark"> Report Type - </span><span class="text-capitalize">{{ reportData?.type || 'N/A'  }}</span></h6>
        </div>
        <!-- Header with Step Indicators -->
        <div class="wizard-header mt-4">
          <div v-for="(step, i) in steps" :key="i" class="step-wrapper">
            <button
              class="step-btn"
              :class="{
                active: currentStep === step.id,
                completed: currentStep > step.id
              }"
              @click="goToStep(step.id)"
            >
              {{ step.id }} 
            </button>
            <div
              class="step-label text-secondary"
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
            <InspectionAreas @goToStep="goToStep" />
          </div>

          <!-- Step 2 -->
          <div v-if="currentStep === 2" class="content-step active">
            <Checklist @goToStep="goToStep" />
          </div>

          <!-- Step 3 -->
          <div v-if="currentStep === 3" class="content-step active">
            <GenerateReport @goToStep="goToStep" />
          </div>

          <!-- Step 4 -->
          <div v-if="currentStep === 4" class="content-step active">
            <Download @goToStep="goToStep" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  import { toastNotifications } from '@/composables/toastNotifications'
  import InspectionAreas from '@/realtor/views/reports/InspectionAreas.vue'
  import Checklist from '@/realtor/views/reports/Checklist.vue'
  import Download from '@/realtor/views/reports/Download.vue'
  import GenerateReport from '@/realtor/views/reports/GenerateReport.vue'
  import { localeAwareLongDateFormat } from '@/utils/datetimeFormatter'
  import { 
    getReport
  } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const pageHeading = ref('')
  const route = useRoute()
  const reportId = route.params.id
  const { showToast } = toastNotifications()

  const { data: reportData, execute: execute1 } = useApi(getReport, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
    setupPageFieldsData();
  })

  function setupPageFieldsData(){
    pageHeading.value = reportData.value.title + ' - ' + reportData.value.property.name
  }

  const currentStep = ref(1)

  const steps = [
    { id: 1, label: "Inspection Area" },
    { id: 2, label: "Checklist" },
    { id: 3, label: "Generate" },
    { id: 4, label: "Download" },
  ]

  const goToStep = (step) => {
    currentStep.value = step;
  }
</script>

<style scoped>
  .page-heading {
    color: #4b4949;
    font-weight: 700;
    font-size: 2.3rem;
    text-align: center;
  }

  .report-data{
    justify-content: center;
    gap: 55px;
  }

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

  /* Horizontal Step Indicator */
  .wizard-header {
    background: #f7f7f7;
    padding: 20px 70px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    display: flex;
    gap: 25px;
  }

  .wizard-header .step-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .step-btn {
    z-index: 1;
  }

  /* Step Labels */
  .step-label {
    text-align: center;
    margin-top: 10px;
    font-size: 0.85rem;
  }

  .step-btn.active ~ .step-label,
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
  }
</style>