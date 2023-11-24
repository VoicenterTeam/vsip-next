import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("Example", defineAsyncComponent(() => import("C:/Users/Bohdan/WebstormProjects/forms-project/form-renderer/docs/src/.vuepress/components/Example.vue")))
  },
}
