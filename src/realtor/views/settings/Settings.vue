<template>
  <div>
    <CCard class="settings-card">
      <CCardHeader class="mb-3">
        <CRow>
          <CCol :sm="12">
            <h2 class="card-title mb-1">Settings</h2>
            <div class="text-body-secondary fs-7">Configure user preferences and personalize your application settings quickly and easily.</div>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <!-- Navigation Tabs -->
        <div class="settings-nav">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            class="nav-tab"
            :class="{ 'active-section': activeTab === tab.name }"
            @click="activeTab = tab.name"
          >
            {{ tab.name }}

            <!-- Badge -->
            <span v-if="tab.badge" class="badge">{{ tab.badge }}</span>
          </button>
        </div>

        <!-- Main Content -->
        <div class="settings-content">

          <!-- Section Header -->
          <div class="section-header">
            <div>
              <h2>{{ activeTab }}</h2>
              <p>{{ tabDescriptions[activeTab] }}</p>
            </div>
          </div>

          <!-- Settings - Profile -->
          <Profile v-if="activeTab === 'Profile'" />
        </div>

      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import Profile from '@/realtor/views/settings/Profile.vue'

  const activeTab = ref("Profile")

  // Tabs
  const tabs = [
    { name: "Profile" },
    { name: "Password" },
  ]

  // Tab descriptions
  const tabDescriptions = {
    "Profile": "Manage your personal information and contact preferences.",
    "Password": "Update your password to secure your account.",
  }
</script>

<style scoped>
  .settings-card{
    border: none !important;
  }

  .settings-card .card-header{
    border-bottom: none !important;
    background: transparent;
  }

  /* Navigation Tabs */
  .settings-card .settings-nav {
    display: flex;
    gap: 30px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 40px;
    overflow-x: auto;
    padding-bottom: 16px;
  }

  .settings-card .nav-tab {
    background: none;
    border: none;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    padding-bottom: 8px;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-card .nav-tab:hover {
    color: #333;
  }

  .settings-card .nav-tab.active-section {
    color: #02aad3;
    border-bottom-color: #02aad3;
    font-weight: bold;
  }

  .settings-card .badge {
    background-color: #5e5ce6;
    color: white;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: 600;
  }

  /* Section Header */
  .settings-card .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    position: relative;
  }

  .settings-card .section-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .settings-card .section-header p {
    font-size: 14px;
    color: #666;
  }

</style>