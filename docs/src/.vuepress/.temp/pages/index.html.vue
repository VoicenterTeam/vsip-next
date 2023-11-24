<template><div><h1 id="form-renderer-library" tabindex="-1"><a class="header-anchor" href="#form-renderer-library" aria-hidden="true">#</a> Form Renderer library</h1>
<p>This is Vue 3.x + Typescript library for rendering dynamic forms</p>
<h2 id="pre-requirements" tabindex="-1"><a class="header-anchor" href="#pre-requirements" aria-hidden="true">#</a> Pre requirements</h2>
<p>Make sure you have installed the <a href="https://www.npmjs.com/package/@voicenter-team/voicenter-ui-plus" target="_blank" rel="noopener noreferrer">voicenter-ui-plus<ExternalLinkIcon/></a> library</p>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2>
<ol>
<li>run <code v-pre>yarn add @voicenter-team/forms-renderer</code> or <code v-pre>npm i @voicenter-team/forms-renderer</code></li>
<li>Now you can use main component as:</li>
</ol>
<div class="language-vue line-numbers-mode" data-ext="vue"><pre v-pre class="language-vue"><code>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FormRenderer</span>
        <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formRendererModel<span class="token punctuation">"</span></span>
        <span class="token attr-name">categories-display-type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>collapse<span class="token punctuation">"</span></span>
        <span class="token attr-name">:parameter-categories</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formRendererParameterCategoriesList<span class="token punctuation">"</span></span>
    <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ts<span class="token punctuation">"</span></span> <span class="token attr-name">setup</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span>ref<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'vue'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>FormRenderer<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@voicenter-team/form-renderer'</span>

<span class="token keyword">const</span> formRendererModel <span class="token operator">=</span> ref<span class="token operator">&lt;</span><span class="token punctuation">{</span> <span class="token punctuation">[</span>key<span class="token operator">:</span> string<span class="token punctuation">]</span><span class="token operator">:</span> any <span class="token punctuation">}</span><span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> formRendererParameterCategoriesList <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'Category 1'</span><span class="token punctuation">,</span>
        <span class="token literal-property property">componentParameters</span><span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token punctuation">{</span>
                <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'String'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'NameInput'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">propJpath</span><span class="token operator">:</span> <span class="token string">'$.name'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">parameterData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                    <span class="token literal-property property">icon</span><span class="token operator">:</span> <span class="token string">'vc-icon-answer'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'text'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">defaultValue</span><span class="token operator">:</span> <span class="token string">'Defa'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">subtitle</span><span class="token operator">:</span> <span class="token string">'Subtitle'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">'Title'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">mandatory</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">helpText</span><span class="token operator">:</span> <span class="token string">'Help Text'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">validationRegex</span><span class="token operator">:</span> <span class="token string">'\\S'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">validationMessage</span><span class="token operator">:</span> <span class="token string">'The field is required and must contain only valid characters!'</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token punctuation">{</span>
                <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'YNSelect'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
                <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'IsDeveloper'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">propJpath</span><span class="token operator">:</span> <span class="token string">'$.isDeveloper'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">parameterData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                    <span class="token literal-property property">icon</span><span class="token operator">:</span> <span class="token string">'vc-icon-up'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">defaultValue</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">'Is developer?'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">helpText</span><span class="token operator">:</span> <span class="token string">'Help Text'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">mandatory</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">subtitle</span><span class="token operator">:</span> <span class="token string">'Subtitle'</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token punctuation">{</span>
                <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'String'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
                <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'WhyIsNotDeveloper'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">propJpath</span><span class="token operator">:</span> <span class="token string">'$.whyIsNotDeveloper'</span><span class="token punctuation">,</span>
                <span class="token literal-property property">parameterData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                    <span class="token literal-property property">icon</span><span class="token operator">:</span> <span class="token string">'vc-icon-type'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">defaultValue</span><span class="token operator">:</span> <span class="token string">''</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">subtitle</span><span class="token operator">:</span> <span class="token string">'Subtitle'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">'Why you are not developer?'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">mandatory</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'textarea'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">helpText</span><span class="token operator">:</span> <span class="token string">'Help Text'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">validationRegex</span><span class="token operator">:</span> <span class="token string">'\\S'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">validationMessage</span><span class="token operator">:</span> <span class="token string">'Value cannot be empty!'</span><span class="token punctuation">,</span>
                    <span class="token literal-property property">parameterConditions</span><span class="token operator">:</span> <span class="token punctuation">[</span>
                        <span class="token punctuation">{</span>
                            <span class="token literal-property property">parameterConditionList</span><span class="token operator">:</span> <span class="token punctuation">[</span>
                                <span class="token punctuation">{</span>
                                    <span class="token literal-property property">parameterConditionJPath</span><span class="token operator">:</span> <span class="token string">'$.isDeveloper'</span><span class="token punctuation">,</span>
                                    <span class="token literal-property property">parameterConditionOperator</span><span class="token operator">:</span> <span class="token string">'='</span><span class="token punctuation">,</span>
                                    <span class="token literal-property property">parameterConditionValue</span><span class="token operator">:</span> <span class="token boolean">false</span>
                                <span class="token punctuation">}</span>
                            <span class="token punctuation">]</span>
                        <span class="token punctuation">}</span><span class="token punctuation">,</span>
                        <span class="token punctuation">{</span>
                            <span class="token literal-property property">parameterConditionList</span><span class="token operator">:</span> <span class="token punctuation">[</span>
                                <span class="token punctuation">{</span>
                                    <span class="token literal-property property">parameterConditionJPath</span><span class="token operator">:</span> <span class="token string">'$.name'</span><span class="token punctuation">,</span>
                                    <span class="token literal-property property">parameterConditionOperator</span><span class="token operator">:</span> <span class="token string">'='</span><span class="token punctuation">,</span>
                                    <span class="token literal-property property">parameterConditionValue</span><span class="token operator">:</span> <span class="token string">'notdev'</span>
                                <span class="token punctuation">}</span>
                            <span class="token punctuation">]</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">]</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="documentation" tabindex="-1"><a class="header-anchor" href="#documentation" aria-hidden="true">#</a> Documentation</h2>
<p>Visit <a href="https://form-renderer.pages.dev/" target="_blank" rel="noopener noreferrer">documentation<ExternalLinkIcon/></a> for detailed info</p>
</div></template>


