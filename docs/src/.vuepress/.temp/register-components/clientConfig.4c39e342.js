import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("CustomComponent", defineAsyncComponent(() => import("C:/Users/Bohdan/WebstormProjects/forms-project/form-renderer/docs/src/.vuepress/components/CustomComponent.vue"))),
      app.component("CustomComponentComplex", defineAsyncComponent(() => import("C:/Users/Bohdan/WebstormProjects/forms-project/form-renderer/docs/src/.vuepress/components/CustomComponentComplex.vue"))),
      app.component("Example", defineAsyncComponent(() => import("C:/Users/Bohdan/WebstormProjects/forms-project/form-renderer/docs/src/.vuepress/components/Example.vue")))
  },
}
