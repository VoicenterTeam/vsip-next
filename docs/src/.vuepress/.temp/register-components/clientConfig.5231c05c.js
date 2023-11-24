import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("CustomComponent", defineAsyncComponent(() => import("D:/Projects/Voicenter/form-renderer/docs/src/.vuepress/components/CustomComponent.vue"))),
      app.component("CustomComponentComplex", defineAsyncComponent(() => import("D:/Projects/Voicenter/form-renderer/docs/src/.vuepress/components/CustomComponentComplex.vue"))),
      app.component("Example", defineAsyncComponent(() => import("D:/Projects/Voicenter/form-renderer/docs/src/.vuepress/components/Example.vue")))
  },
}
