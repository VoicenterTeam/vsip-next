import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("Children", defineAsyncComponent(() => import("C:/Users/bohda/WebstormProjects/libraries/vsip-next/docs/src/.vuepress/components/Children.vue"))),
      app.component("Example", defineAsyncComponent(() => import("C:/Users/bohda/WebstormProjects/libraries/vsip-next/docs/src/.vuepress/components/Example.vue")))
  },
}
