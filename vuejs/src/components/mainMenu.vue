<template>
    <ion-menu side="end" type="overlay" content-id="main-menu">
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="full" :key="listKey">
                <ion-item
                    button
                    v-for="(item, key) in pages"
                    :key="key"
                    @click="eventMenuClick(key, item)"
                >
                    <ion-icon slot="start" :name="item.icon" />
                    <ion-label>{{ item.title }}</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({

    /**
     * Data
     */

    data() {
        const allPages: any = {
            config: {
                title: 'Config',
                icon: 'create',
            },
            settings: {
                title: 'Settings',
                icon: 'cog',
            }
        }
        const pages: any = { ...allPages }
        if (this.$route.name != null) {
            delete pages[this.$route.name]
        }
        return {
            listKey: 0,
            allPages: allPages,
            pages: pages,
        }
    },

    /**
     * Methods
     */

    methods: {

        /**
         * Event: menu click
         */

        async eventMenuClick(name: string, item: any) {
            await this.$ionic.menuController.close()
            if (item.action == null) {
                this.$router.push({ name: name })
            }
            else {
                await item.action.bind(this)()
            }
        },
    },

    /**
     * Watchers
     */

    watch: {

        /**
         * Route watch
         */

        $route (to, from) {
            if (Object.keys(this.allPages).includes(to.name)) {
                this.pages = { ...this.allPages }
                delete this.pages[to.name]
                this.listKey += 1
            }
        },
    }
})

</script>