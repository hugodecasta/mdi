<template>
    <div
        class='pa-10 mt-10'
        style='max-width:1000px;margin-left:auto;margin-right:auto'
    >
        <h1 style="display:inline-block;width:100%;text-align:center">Material Design Icons</h1>
        <div>
            <ui-textfield
                class='mb-10'
                outlined
                v-model="search_text"
                label='search for icon (use "!" to exclude words)'
                style="width:calc(100%)"
            ></ui-textfield>
        </div>
        <ui-drawer-title
            v-if="data_text"
            class='mb-5'
        >{{data_text}}</ui-drawer-title>
        <ui-spinner
            class='mx-auto'
            v-if="searching"
            active
            style="margin-left:calc(50% - 25px);margin-top:100px;"
        ></ui-spinner>
        <template v-else>
            <icon
                v-for="icon in icons_to_disp"
                :key="icon.id"
                :copy_with_mdi="copy_with_mdi"
                :icon="icon"
            />
        </template>
    </div>
    <div
        class='footer'
        v-html="footer"
    />
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, computed, watch } from 'vue'
import api from './plugins/api'
import Icon from './components/icon.vue'

const year = (new Date()).getFullYear()
const footer = '<u>mdi.hugocastaneda.fr</u> © 2022' + (year != '2022' ? ' - ' + year : '') + ' Hugo castaneda - inspired by materialdesignicons.com'

const search_text = ref('')

const copy_with_mdi = ref(false)

const icons_to_disp = reactive([])

const is_searching = computed(() => search_text.value != "")
const needs_more = computed(() => is_searching.value && search_text.value.length < 3)

const searching = ref(false)

function set_icons(icons, text = '') {
    icons_to_disp.splice(0, 100000)
    icons_to_disp.push(...icons)
    data_text.value = text
}

async function search(q_txt) {
    searching.value = true
    data_text.value = 'searching...'
    const found = await api.api.search({ text: q_txt })
    searching.value = false
    let text = '"' + q_txt + '"'
    if (!found.length) text = 'No results for: ' + text
    else text = 'Results for: ' + text
    set_icons(found, text)
}

const data_text = ref('')

let to = null
watch(search_text, () => {
    clearTimeout(to)
    if (!is_searching.value || needs_more.value) {
        data_text.value = 'need a little more and we\'re good'
        return
    }
    to = setTimeout(() => search(search_text.value), 300)
})

onMounted(async () => {
    set_icons(await api.api.random(), 'Some random icons for you !')

})

</script>


<style>
body {
    color: #333 !important;
}
.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
    color: var(
        --mdc-text-button-label-text-color,
        var(--mdc-theme-primary, #6200ee)
    ) !important;
}
.footer {
    position: fixed;
    z-index: -1;
    bottom: 10px;
    opacity: 0.2;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
}
</style>