<template>
    <div class='icon'>
        <svg
            width="48px"
            height="48px"
            viewBox="0 0 24 24"
        >
            <path
                fill="#6F6F6F"
                :d="icon.data"
            />
        </svg>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, defineProps } from 'vue'

const props = defineProps({
    icon: Object
})

</script>

<style scoped>
.icon {
    vertical-align: middle;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    display: inline-block;
    width: 70px;
    height: 70px;
    padding: 10px;
}
</style>
