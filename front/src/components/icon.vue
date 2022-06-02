<template>
    <div
        :class='["little_icon",is_google ? "":"orange"]'
        @click="open_icon()"
    >
        <svg>
            <path :d="icon.data" />
        </svg>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, defineProps, computed } from 'vue'

const props = defineProps({
    icon: Object,
    copy_with_mdi: Boolean,
})

const is_google = computed(() => props.icon.user.name == 'Google')

function open_icon() {
    const name_to_copy = (props.copy_with_mdi ? 'mdi-' : '') + props.icon.name
    navigator.clipboard.writeText(name_to_copy)
}

</script>

<style scoped>
svg {
    width: 24px;
    height: 24px;
    overflow: hidden;
}
.icon {
    vertical-align: middle;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    display: inline-block;
    width: 70px;
    height: 70px;
    padding: 10px;
    margin: 10px;
}

.little_icon {
    width: 50px;
    height: 50px;
    padding: 12px;
    margin: 0 0 12px 12px;
    border: 1px solid #e5e5e5;
    display: inline-block;
    box-sizing: border-box;
    overflow: visible;
    -webkit-appearance: button;
    border: 1px solid #fff;
    border-radius: 3px;
    background-color: #fff;
    transition: transform 0.3s;
}

.little_icon:hover {
    background: #6f6f6f;
    cursor: pointer;
}
svg path {
    fill: #6f6f6f;
}
.little_icon:hover svg path {
    fill: #fff;
}

.little_icon:active {
    transition: transform 0s;
    transform: scale(0.95);
}

.little_icon.orange {
    border-color: rgba(255, 87, 34, 0.5);
    border-radius: 2px;
}
</style>
