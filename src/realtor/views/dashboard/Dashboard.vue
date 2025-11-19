<template>
  <div>
    <CCard class="dashboard-card">
      <CCardHeader class="mb-3">
        <CRow>
          <CCol :sm="12">
            <h2 class="card-title mb-1">Dashboard</h2>
            <div class="text-body-secondary fs-7">Review inspection statistics and monitor productivity across all ongoing activities.</div>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow class="mb-2 text-center statistics-row">
          <CCol class="statistics-card">
            <CRow class="statistics-card-row">
              <div class="statistics-card-icon">
                <span><CIcon icon="cil-description" size="lg" /></span>
              </div>
              <div class="statistics-card-data">
                <div class="text-dark fs-7 mb-1">Generated Reports</div>
                <div class="fw-bold statistics-numbers">{{ dashboardData?.generated_reports }}</div>
              </div>
            </CRow>
          </CCol>
          <CCol class="statistics-card">
            <CRow class="statistics-card-row">
              <div class="statistics-card-icon">
                <span><CIcon icon="cil-house" size="lg" /></span>
              </div>
              <div class="statistics-card-data">
                <div class="text-dark fs-7 mb-1">Total Properties</div>
                <div class="fw-bold statistics-numbers">{{ dashboardData?.total_properties }}</div>
              </div>
            </CRow>
          </CCol class="statistics-card">
          <CCol class="statistics-card">
            <CRow class="statistics-card-row">
              <div class="statistics-card-icon">
                <span><CIcon icon="cil-group" size="lg" /></span>
              </div>
              <div class="statistics-card-data">
                <div class="text-dark fs-7 mb-1">Total Clients</div>
                <div class="fw-bold statistics-numbers">{{ dashboardData?.total_clients }}</div>
              </div>
            </CRow>
          </CCol>
          <CCol class="statistics-card">
            <CRow class="statistics-card-row">
              <div class="statistics-card-icon">
                <span><CIcon icon="cil-vector" size="lg" /></span>
              </div>
              <div class="statistics-card-data">
                <div class="text-dark fs-7 mb-1">Total Branches</div>
                <div class="fw-bold statistics-numbers">{{ dashboardData?.total_branches }}</div>
              </div>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
      <CRow class="mx-0 dashboard-create-btns-container dashboard-create-btns-card">
        <div class="dashboard-create-btns-icon mb-3">
          <span style="color: #7b7979;"><CIcon icon="cil-paper-plane" size="xxl" /></span>
        </div>
        <div class="dashboard-create-btns-data">
          <h3>Let's Dive Into</h3>
          <div class="text-body-secondary fs-6 mb-1">Create new report for your client or create new client</div>
          <CButton color="info" class="text-white mt-3 px-4 py-2 fs-8" @click="showNewReportModal = true"><CIcon icon="cilDescription" /> Add New Report</CButton>
          <CButton color="dark" class="text-white mt-3 px-4 py-2 fs-8 ms-2" as="a" href="/realtor/clients/add_client"><CIcon icon="cilUser" /> Add New Client</CButton>
        </div>
      </CRow>
    </CCard>
  </div>
  <CreateReport v-model:visibility="showNewReportModal" />
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue'
  import CreateReport from '@/components/Modals/CreateReport.vue'
  import { getDashboardData } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const showNewReportModal = ref(false)
  const { data: dashboardData, execute } = useApi(getDashboardData, false)

  onBeforeMount(async () => {
    await execute()
  })

</script>

<style scoped>
  .dashboard-card{
    border: none !important;
  }

  .dashboard-card .card-header{
    border-bottom: none !important;
    background: transparent;
  }

  .statistics-row{
    gap: 20px;
  }

  .statistics-card,
  .dashboard-create-btns-card{
    background: #fbfbfb;
    padding: 30px 0px;
    border-radius: 10px;
    border: 1px solid #ebebeb;
    box-shadow: 0 2px 6px 0 rgb(241 241 241 / 65%), 0 2px 6px 0 rgb(214 214 242 / 54%);
  }

  .statistics-card-row{
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 0;
    margin-right: 0;
  }

  .statistics-card-row .statistics-card-icon{
    flex: 0 0 32%;
    border-right: 1px solid #e1e0e0;
    margin-right: 12px;
  }

  .statistics-card-row .statistics-card-data{
    flex: 0 0 60%;
    text-align: left;
  }

  .statistics-card-row .statistics-card-icon,
  .statistics-card-row .statistics-card-data{
    padding-left: 0;
    padding-right: 0;
  }

  .statistics-card-row .statistics-card-icon span{
    padding: 15px 17px;
    background-color: #02aad3;
    border-radius: 50%;
    color: #fff;
  }

  .statistics-card-row .statistics-card-data .statistics-numbers{
    color: #aaaaaa !important;
    font-size: 22px;
  }

  .dashboard-create-btns-container{
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .dashboard-create-btns-data h3{
    text-transform: uppercase;
    font-weight: 500;
  }
</style>