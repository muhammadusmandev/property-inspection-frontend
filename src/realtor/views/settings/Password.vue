<template>
  <div>
    <!-- Password -->
    <CForm class="settings-password" @submit.prevent="submitUpdatePassword">
        <!-- Old Password -->
        <div class="form-group mb-3 col-md-4">
            <label>Old Password</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText>
                    <CIcon icon="cil-lock-locked" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="old_password"
                    placeholder="Enter your old Password"
                    type="password"
                    @blur="oldPasswordMeta.touched = true; oldPasswordValidate()"
                />
            </CInputGroup>
            <div class="form-field-error d-inline-block mt-2 w-auto" v-if="oldPasswordMeta.touched && oldPasswordError">
                <span>* {{ oldPasswordError }}</span>
            </div>
        </div>

        <!-- New Password -->
        <div class="form-group mb-3 col-md-4">
            <label>New Password</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText>
                    <CIcon icon="cil-lock-locked" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="password"
                    type="password"
                    placeholder="Enter your new Password"
                    @blur="passwordMeta.touched = true; passwordValidate()"
                />
            </CInputGroup>
            <div class="form-field-error d-inline-block mt-2 w-auto" v-if="passwordMeta.touched && passwordError">
                <span>* {{ passwordError }}</span>
            </div>
        </div>

        <!-- Confirm New Password -->
        <div class="form-group mb-3 col-md-4">
            <label>Confirm New Password</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText>
                    <CIcon icon="cil-lock-locked" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="cpassword"
                    type="password"
                    placeholder="Confirm your new Password"
                    @blur="cpasswordMeta.touched = true; cpasswordValidate()"
                />
            </CInputGroup>
            <div class="form-field-error d-inline-block mt-2 w-auto" v-if="cpasswordMeta.touched && cpasswordError">
                <span>* {{ cpasswordError }}</span>
            </div>
        </div>

        <!-- Save Button -->
        <div class="form-actions">
            <CButton class="px-4 self-button create-account-btn mx-auto fs-8 btn-save" type="submit" :disabled="btnLoading"> <CIcon icon="cil-user" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Changing...' : 'Change Password' }} </CButton>
        </div>
    </CForm>
  </div>
</template>

<script setup>
  import { ref } from "vue"
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import { settingsResetPassword } from '@/services/api'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { useApi } from '@/composables/useApi'

  const { showToast } = toastNotifications()
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

  const { loading: btnLoading, execute: updatePasswordExecute } = useApi(settingsResetPassword, false)

  const schema = toTypedSchema( yup.object({
    old_password: yup
      .string()
      .required('Old password is required'),

    password: yup
      .string()
      .required('New password is required')
      .min(8, 'New password must be at least 8 characters')
      .matches(
        strongPasswordRegex,
        'Password must include uppercase, lowercase, number, and special character'
      ),

    cpassword: yup
      .string()
      .required('Please confirm your new password')
      .oneOf([yup.ref('password')], 'New Password must match'),
  }))

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema
  })

  const { 
    value: old_password, 
    errorMessage: oldPasswordError,
    validate: oldPasswordValidate,
    meta: oldPasswordMeta
  } = useField('old_password')

  const { 
    value: password, 
    errorMessage: passwordError,
    validate: passwordValidate,
    meta: passwordMeta
  } = useField('password')

  const { 
    value: cpassword, 
    errorMessage: cpasswordError,
    validate: cpasswordValidate,
    meta: cpasswordMeta
  } = useField('cpassword')

  const submitUpdatePassword = handleSubmit(async (formData) => {
    const response = await updatePasswordExecute({ payload: formData })

    if(response.success === true){
      showToast('success', 'Password changed successfully!')
    }
  })
</script>

<style scoped>
  .settings-password{
    border: none !important;
  }

  /* Form Actions */
  .settings-password .form-actions {
    padding-top: 20px;
    border-top: 1px solid #ddd;
    margin-top: 30px;
  }

  .settings-password .btn-save:hover {
    background-color: #4c4acc;
  }

</style>