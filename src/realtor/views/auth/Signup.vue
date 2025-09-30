<template>
  <div class="min-h-screen flex flex-row items-center justify-center bg-gray-100">
    <div class="w-full max-w-xl px-4">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="p-6">
          <form>
            <h1 class="text-2xl font-semibold mb-2">Register</h1>
            <p class="text-gray-500 mb-6">Create your account</p>

            <!-- Username -->
            <div class="flex items-center border rounded mb-3 px-3 py-2 bg-white">
              <span class="text-gray-500 mr-2">
                <!-- Use any icon component or font-awesome here -->
                <i class="fas fa-user"></i>
              </span>
              <input
                type="text"
                placeholder="Username"
                autocomplete="username"
                class="w-full outline-none border-none bg-transparent"
              />
            </div>

            <!-- Email -->
            <div class="flex items-center border rounded mb-3 px-3 py-2 bg-white">
              <span class="text-gray-500 mr-2">@</span>
              <input
                type="email"
                placeholder="Email"
                autocomplete="email"
                class="w-full outline-none border-none bg-transparent"
              />
            </div>

            <!-- Password -->
            <div class="flex items-center border rounded mb-3 px-3 py-2 bg-white">
              <span class="text-gray-500 mr-2">
                <i class="fas fa-lock"></i>
              </span>
              <input
                type="password"
                placeholder="Password"
                autocomplete="new-password"
                class="w-full outline-none border-none bg-transparent"
              />
            </div>

            <!-- Repeat Password -->
            <div class="flex items-center border rounded mb-4 px-3 py-2 bg-white">
              <span class="text-gray-500 mr-2">
                <i class="fas fa-lock"></i>
              </span>
              <input
                type="password"
                placeholder="Repeat password"
                autocomplete="new-password"
                class="w-full outline-none border-none bg-transparent"
              />
            </div>

            <!-- Button -->
            <div class="w-full">
              <button
                type="submit"
                class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
</style>