<template>
    <div class="page-heading border-bottom">
        <h2 v-if="heading">{{ heading }}</h2>
        <p v-if="description">{{ description }}</p>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue'

    const props = defineProps({
        heading: { type: String, default: '' },
        description: { type: String, default: '' }
    })
</script>

<style scoped>
    .body-card .page-heading h2{
        color: #4b4949;
        font-weight: 700;
        font-size: 2.3rem;
    }

    .body-card .page-heading p{
        color: #9b9b9b;
        font-size: 1.08rem;
    }
</style>
