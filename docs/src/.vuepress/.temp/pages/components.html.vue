<template><div><h1 id="components" tabindex="-1"><a class="header-anchor" href="#components" aria-hidden="true">#</a> Components</h1>
<p>The library do exports the following components:</p>
<nav class="table-of-contents"><ul><li><router-link to="#formrenderer">FormRenderer</router-link><ul><li><router-link to="#description">Description</router-link></li><li><router-link to="#example">Example</router-link></li><li><router-link to="#api">API</router-link></li></ul></li></ul></nav>
<h2 id="formrenderer" tabindex="-1"><a class="header-anchor" href="#formrenderer" aria-hidden="true">#</a> FormRenderer</h2>
<h3 id="description" tabindex="-1"><a class="header-anchor" href="#description" aria-hidden="true">#</a> Description</h3>
<p>The main component that handles the render of the form.</p>
<h3 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example</h3>
<h4 id="basic-usage" tabindex="-1"><a class="header-anchor" href="#basic-usage" aria-hidden="true">#</a> Basic Usage</h4>
<div class="language-vue line-numbers-mode" data-ext="vue"><pre v-pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FormRenderer</span>
        <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formRendererModel<span class="token punctuation">"</span></span>
        <span class="token attr-name">categories-display-type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>collapse<span class="token punctuation">"</span></span>
        <span class="token attr-name">:parameter-categories</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formRendererParameterCategoriesList<span class="token punctuation">"</span></span>
    <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ts<span class="token punctuation">"</span></span> <span class="token attr-name">setup</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'vue'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ObjectAnyType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/generic'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TParametersCategory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/parametersCategory'</span>

<span class="token comment">/* Data */</span>
<span class="token keyword">const</span> formRendererModel <span class="token operator">=</span> ref<span class="token operator">&lt;</span>ObjectAnyType<span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token literal-property property">parameterCategories</span><span class="token operator">:</span> Array<span class="token operator">&lt;</span>TParametersCategory<span class="token operator">></span> <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token comment">/* Your categories here */</span> <span class="token punctuation">]</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="providing-some-custom-component" tabindex="-1"><a class="header-anchor" href="#providing-some-custom-component" aria-hidden="true">#</a> Providing some custom component</h4>
<div class="language-vue line-numbers-mode" data-ext="vue"><pre v-pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FormRenderer</span>
        <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formRendererModel<span class="token punctuation">"</span></span>
        <span class="token attr-name">categories-display-type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>collapse<span class="token punctuation">"</span></span>
        <span class="token attr-name">:parameter-categories</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formRendererParameterCategoriesList<span class="token punctuation">"</span></span>
        <span class="token attr-name">:custom-components</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{ CustomComponent }<span class="token punctuation">"</span></span>
    <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ts<span class="token punctuation">"</span></span> <span class="token attr-name">setup</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'vue'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ObjectAnyType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/generic'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TParametersCategory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/parametersCategory'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> CustomComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'src/components/CustomComponent.vue'</span>

<span class="token comment">/* Data */</span>
<span class="token keyword">const</span> formRendererModel <span class="token operator">=</span> ref<span class="token operator">&lt;</span>ObjectAnyType<span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token literal-property property">parameterCategories</span><span class="token operator">:</span> Array<span class="token operator">&lt;</span>TParametersCategory<span class="token operator">></span> <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token comment">/* Your categories here */</span> <span class="token punctuation">]</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Where the CustomComponent is:</p>
<div class="language-vue line-numbers-mode" data-ext="vue"><pre v-pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>{{ parameterData.someTitle }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>{{ model }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ts<span class="token punctuation">"</span></span> <span class="token attr-name">setup</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> TBaseParameterData <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/parameterData'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ExtendParameterDataType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/parameter'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ObjectAnyType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer/library/types/types/generic'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useDynamicComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer'</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">ICustomComponentParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">defaultValue</span><span class="token operator">:</span> string
    <span class="token literal-property property">someTitle</span><span class="token operator">:</span> string
<span class="token punctuation">}</span>

<span class="token keyword">export</span> type TCustomComponentParameter <span class="token operator">=</span> ExtendParameterDataType<span class="token operator">&lt;</span><span class="token string">'CustomParameter'</span><span class="token punctuation">,</span> ICustomComponentParameterData<span class="token operator">></span>

<span class="token comment">/* Props */</span>
<span class="token keyword">export</span> type Props <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">modelValue</span><span class="token operator">:</span> ObjectAnyType
    <span class="token literal-property property">parameter</span><span class="token operator">:</span> TCustomComponentParameter
<span class="token punctuation">}</span>
<span class="token keyword">const</span> props <span class="token operator">=</span> defineProps<span class="token operator">&lt;</span>Props<span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> emit <span class="token operator">=</span> defineEmits<span class="token operator">&lt;</span><span class="token punctuation">{</span>
    <span class="token punctuation">(</span>e<span class="token operator">:</span> <span class="token string">'update:modelValue'</span><span class="token punctuation">,</span> <span class="token literal-property property">payload</span><span class="token operator">:</span> Props<span class="token punctuation">[</span><span class="token string">'modelValue'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span><span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">/* Data */</span>
<span class="token keyword">const</span> <span class="token literal-property property">parameterData</span><span class="token operator">:</span> ICustomComponentParameterData <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>props<span class="token punctuation">.</span>parameter<span class="token punctuation">.</span>parameterData<span class="token punctuation">,</span>
    <span class="token literal-property property">someTitle</span><span class="token operator">:</span> props<span class="token punctuation">.</span>parameter<span class="token punctuation">.</span>parameterData<span class="token punctuation">.</span>someTitle <span class="token operator">??</span> <span class="token string">'TEST'</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> model <span class="token operator">=</span> <span class="token function">useDynamicComponent</span><span class="token punctuation">(</span>props<span class="token punctuation">,</span> parameterData<span class="token punctuation">,</span> emit<span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h3>
<h4 id="attributes" tabindex="-1"><a class="header-anchor" href="#attributes" aria-hidden="true">#</a> Attributes</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th style="text-align:left">Description</th>
<th style="text-align:left">Type</th>
<th style="text-align:left">Default</th>
</tr>
</thead>
<tbody>
<tr>
<td>parameter-categories</td>
<td style="text-align:left">The list of categories to render</td>
<td style="text-align:left">array <RouterLink to="/types.html#tparameterscategory">see TParametersCategory</RouterLink></td>
<td style="text-align:left">-</td>
</tr>
<tr>
<td>model-value / v-model</td>
<td style="text-align:left">The model of the form</td>
<td style="text-align:left">object</td>
<td style="text-align:left">-</td>
</tr>
<tr>
<td>categories-display-type</td>
<td style="text-align:left">How categories will be displayed</td>
<td style="text-align:left">string <RouterLink to="/types.html#tparametercategorydisplaytypenames">see TParameterCategoryDisplayTypeNames</RouterLink></td>
<td style="text-align:left">plain</td>
</tr>
<tr>
<td>custom-components</td>
<td style="text-align:left">Some custom vue components to render</td>
<td style="text-align:left">object <RouterLink to="/types.html#icustomcomponents">see ICustomComponents</RouterLink></td>
<td style="text-align:left">{}</td>
</tr>
</tbody>
</table>
<h4 id="events" tabindex="-1"><a class="header-anchor" href="#events" aria-hidden="true">#</a> Events</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th style="text-align:left">Description</th>
<th style="text-align:left">Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>update:modelValue</td>
<td style="text-align:left">When the form model change</td>
<td style="text-align:left">object</td>
</tr>
</tbody>
</table>
<h4 id="slots" tabindex="-1"><a class="header-anchor" href="#slots" aria-hidden="true">#</a> Slots</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th style="text-align:left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>parameter-category-{categoryUid}</td>
<td style="text-align:left">Dynamic slot for each category</td>
</tr>
</tbody>
</table>
<h4 id="exposes" tabindex="-1"><a class="header-anchor" href="#exposes" aria-hidden="true">#</a> Exposes</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th style="text-align:left">Description</th>
<th style="text-align:left">Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>validateAllCategories</td>
<td style="text-align:left">Will validate all categories</td>
<td style="text-align:left">function</td>
</tr>
<tr>
<td>resetAllCategoriesFields</td>
<td style="text-align:left">Will reset all categories fields</td>
<td style="text-align:left">function</td>
</tr>
<tr>
<td>validateCategory</td>
<td style="text-align:left">Will validate category</td>
<td style="text-align:left">function</td>
</tr>
<tr>
<td>resetCategoryFields</td>
<td style="text-align:left">Will reset specific category fields</td>
<td style="text-align:left">function</td>
</tr>
</tbody>
</table>
</div></template>


