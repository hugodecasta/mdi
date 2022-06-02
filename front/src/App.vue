<template>
    <v-app>
        <v-card class='ma-5 pa-5'>
            <v-text-field
                v-model="search_text"
                search_text="search for icon"
            ></v-text-field>
            {{search_text}}
        </v-card>
        <v-card-title v-if="needs_more">To search, type more than 2 letters</v-card-title>
        <v-progress-circular
            v-if="searching"
            indeterminate
        ></v-progress-circular>
        <icon
            v-for="icon in icons_to_disp"
            :key="icon.id"
            :icon="icon"
        />
    </v-app>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, computed, watch } from 'vue'
import api from './plugins/api'
import icon from './components/icon.vue'

const search_text = ref('')

const icons_to_disp = reactive([])

const is_searching = computed(() => search_text.value != "")
const needs_more = computed(() => is_searching.value && search_text.value.length < 3)

const searching = ref(false)

function set_icons(icons) {
    icons_to_disp.splice(0, 100000)
    icons_to_disp.push(...icons)
}

async function search() {
    searching.value = true
    const found = await api.api.search({ text: search_text.value })
    console.log(found)
    searching.value = false
    set_icons(found)
}

let to = null
watch(search_text, () => {
    clearTimeout(to)
    to = setTimeout(search, 300)
})

onMounted(async () => {
    set_icons(await api.api.random())

})

</script>
