<template>
    <div
        :class='["little_icon",is_google ? "":"orange"]'
        @click="open_icon()"
        :data-tooltip-id="icon.id"
    >
        <svg
            width="24px"
            height="24px"
        >
            <path :d="icon.data" />
        </svg>

        <ui-tooltip :id="icon.id">
            {{icon.name}}
        </ui-tooltip>
    </div>

    <ui-dialog
        v-model="open"
        :closable="true"
        maskClosable
    >
        <ui-dialog-title>
            {{icon.name}}
            <ui-drawer-subtitle
                style='padding-left:24px;display:inline-block'
                v-if="appelations"
            >{{appelations}}
            </ui-drawer-subtitle>
        </ui-dialog-title>

        <ui-dialog-content>
            <svg
                class='demo_svg'
                style="width:80px;height:80px;margin:25px;"
                viewBox="0 0 24 24"
            >
                <path :d="icon.data" />
            </svg>
            <br />
            by {{icon.user.name}}
            <a
                :href="'https://twitter.com/'+icon.user.twitter"
                target="_blank"
                v-if="icon.user.twitter"
            >@{{icon.user.twitter}}</a>

        </ui-dialog-content>
    </ui-dialog>

</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, defineProps, computed } from 'vue'
import { useToast } from 'balm-ui'

const $toast = useToast()

const open = ref(false)

const appelations = computed(() => {
    return [...props.icon.aliases, ...props.icon.tags.map(t => t.name)].filter(e => e).join(' , ')
})

const props = defineProps({
    icon: Object,
    copy_with_mdi: Boolean,
})

const sizes = [50, 35, 24]

const is_google = computed(() => props.icon.user.name == 'Google')

function open_icon() {
    const name_to_copy = (props.copy_with_mdi ? 'mdi-' : '') + props.icon.name
    navigator.clipboard.writeText(name_to_copy)
    $toast('icon copied !')
    open.value = true
}

</script>

<style scoped>
svg {
    overflow: hidden;
}
.icon {
    vertical-align: middle;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    display: inline-block;
    border-radius: 1000px;
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
    border-color: #ff572280;
    border-radius: 2px;
}
</style>
