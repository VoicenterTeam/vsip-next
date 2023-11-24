<template><div><h1 id="types" tabindex="-1"><a class="header-anchor" href="#types" aria-hidden="true">#</a> Types</h1>
<nav class="table-of-contents"><ul><li><router-link to="#tparameterscategory">TParametersCategory</router-link></li><li><router-link to="#tpartialdataparameter">TPartialDataParameter</router-link></li><li><router-link to="#iparameterbase">IParameterBase</router-link></li><li><router-link to="#tbaseparameterdata">TBaseParameterData</router-link><ul><li><router-link to="#istringparameterdata">IStringParameterData</router-link></li><li><router-link to="#inselectparameterdata">INSelectParameterData</router-link></li><li><router-link to="#iynselectparameterdata">IYNSelectParameterData</router-link></li><li><router-link to="#ipninputparameterdata">IPNInputParameterData</router-link></li><li><router-link to="#ilangselectparameterdata">ILangSelectParameterData</router-link></li><li><router-link to="#iaotselectparameterdata">IAOTSelectParameterData</router-link></li><li><router-link to="#idtselectparameterdata">IDTSelectParameterData</router-link></li><li><router-link to="#iiselectparameterdata">IISelectParameterData</router-link></li><li><router-link to="#imiselectparameterdata">IMISelectParameterData</router-link></li></ul></li><li><router-link to="#iparameterconditiongroup">IParameterConditionGroup</router-link></li><li><router-link to="#tparametercondition">TParameterCondition</router-link></li><li><router-link to="#tcomponenttype">TComponentType</router-link></li><li><router-link to="#tparametercategorydisplaytypenames">TParameterCategoryDisplayTypeNames</router-link></li><li><router-link to="#formpromisetype">FormPromiseType</router-link></li><li><router-link to="#icustomcomponents">ICustomComponents</router-link></li></ul></nav>
<h2 id="tparameterscategory" tabindex="-1"><a class="header-anchor" href="#tparameterscategory" aria-hidden="true">#</a> TParametersCategory</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">TParametersCategory</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    uid<span class="token operator">:</span> <span class="token builtin">number</span>
    name<span class="token operator">:</span> <span class="token builtin">string</span>
    componentParameters<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>TPartialDataParameter<span class="token operator">></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tpartialdataparameter" tabindex="-1"><a class="header-anchor" href="#tpartialdataparameter" aria-hidden="true">#</a> TPartialDataParameter</h2>
<p>Partial data parameter is the generic type which extends <a href="#iparameterbase">IParameterBase type</a>
and by the provided <code v-pre>type</code> <a href="#tcomponenttype">TComponentType</a> inherits type for <code v-pre>parameterData</code> prop.
Detailed info about <a href="#tbaseparameterdata">TBaseParameterData</a></p>
<h2 id="iparameterbase" tabindex="-1"><a class="header-anchor" href="#iparameterbase" aria-hidden="true">#</a> IParameterBase</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IParameterBase</span> <span class="token punctuation">{</span>
    type<span class="token operator">:</span> TComponentType
    uid<span class="token operator">:</span> <span class="token builtin">number</span>
    name<span class="token operator">:</span> <span class="token builtin">string</span>
    propJpath<span class="token operator">:</span> <span class="token builtin">string</span>
    parentId<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span>
    parameterConditions<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>IParameterConditionGroup<span class="token operator">></span>
    parameterData<span class="token operator">:</span> TBaseParameterData
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Prop</th>
<th style="text-align:left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>type</td>
<td style="text-align:left">The component to render, may be one of the <a href="#tcomponenttype">TComponentType</a>, or the custom passed component name</td>
</tr>
<tr>
<td>icon</td>
<td style="text-align:left">The icon that will be displayed near the label</td>
</tr>
<tr>
<td>uid</td>
<td style="text-align:left">The unique ID of the parameter</td>
</tr>
<tr>
<td>name</td>
<td style="text-align:left">The name of the parameter</td>
</tr>
<tr>
<td>propJpath</td>
<td style="text-align:left">Has the following struct: <code v-pre>$.userData.name</code>, supports any valid for <a href="https://www.npmjs.com/package/jsonpath" target="_blank" rel="noopener noreferrer">jsponpath library<ExternalLinkIcon/></a> struct. Must be unique!</td>
</tr>
<tr>
<td>parentId</td>
<td style="text-align:left"></td>
</tr>
<tr>
<td>parameterConditions</td>
<td style="text-align:left">If provided the field will be rendered only if meets conditions, see <a href="#iparameterconditiongroup">detailed info</a></td>
</tr>
<tr>
<td>parameterData</td>
<td style="text-align:left"><a href="#tbaseparameterdata">TBaseParameterData</a></td>
</tr>
</tbody>
</table>
<h2 id="tbaseparameterdata" tabindex="-1"><a class="header-anchor" href="#tbaseparameterdata" aria-hidden="true">#</a> TBaseParameterData</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    title<span class="token operator">:</span> <span class="token builtin">string</span>
    mandatory<span class="token operator">:</span> <span class="token builtin">boolean</span>
    defaultValue<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">unknown</span>
    subtitle<span class="token operator">:</span> <span class="token builtin">string</span>
    helpText<span class="token operator">:</span> <span class="token builtin">string</span>
    validationRegex<span class="token operator">:</span> <span class="token builtin">string</span>
    validationMessage<span class="token operator">:</span> <span class="token builtin">string</span>
    icon<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
    <span class="token punctuation">[</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">any</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Prop</th>
<th style="text-align:left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>title</td>
<td style="text-align:left">Used as a label for the field</td>
</tr>
<tr>
<td>mandatory</td>
<td style="text-align:left">If to show asterisk for the label</td>
</tr>
<tr>
<td>defaultValue</td>
<td style="text-align:left">The default value for the field</td>
</tr>
<tr>
<td>subtitle</td>
<td style="text-align:left">-</td>
</tr>
<tr>
<td>helpText</td>
<td style="text-align:left">-</td>
</tr>
<tr>
<td>validationRegex</td>
<td style="text-align:left">The regex string which will be used for field validation if provided</td>
</tr>
<tr>
<td>validationMessage</td>
<td style="text-align:left">The error message which will be shown if validation fails</td>
</tr>
<tr>
<td>Each of the <a href="#tcomponenttype">parameters</a> has its own extended parameterDataType:</td>
<td style="text-align:left"></td>
</tr>
</tbody>
</table>
<h3 id="istringparameterdata" tabindex="-1"><a class="header-anchor" href="#istringparameterdata" aria-hidden="true">#</a> IStringParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IStringParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">string</span>
    type<span class="token operator">?</span><span class="token operator">:</span> VcInputType
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="inselectparameterdata" tabindex="-1"><a class="header-anchor" href="#inselectparameterdata" aria-hidden="true">#</a> INSelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">INSelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">number</span>
    min<span class="token operator">:</span> <span class="token builtin">number</span>
    max<span class="token operator">:</span> <span class="token builtin">number</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="iynselectparameterdata" tabindex="-1"><a class="header-anchor" href="#iynselectparameterdata" aria-hidden="true">#</a> IYNSelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IYNSelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ipninputparameterdata" tabindex="-1"><a class="header-anchor" href="#ipninputparameterdata" aria-hidden="true">#</a> IPNInputParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IPNInputParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ilangselectparameterdata" tabindex="-1"><a class="header-anchor" href="#ilangselectparameterdata" aria-hidden="true">#</a> ILangSelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">ILangSelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="iaotselectparameterdata" tabindex="-1"><a class="header-anchor" href="#iaotselectparameterdata" aria-hidden="true">#</a> IAOTSelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IAOTSelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">number</span>
    max<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span>
    min<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span>
    step<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="idtselectparameterdata" tabindex="-1"><a class="header-anchor" href="#idtselectparameterdata" aria-hidden="true">#</a> IDTSelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IDTSelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> <span class="token builtin">string</span>
    type<span class="token operator">:</span> <span class="token string">'dts'</span> <span class="token operator">|</span> <span class="token string">'dt'</span> <span class="token operator">|</span> <span class="token string">'d'</span> <span class="token comment">// If 'dts' - the date-time picker with seconds will be shown, if 'dt' - the date-time picker will be shown, if 'd' - date picker</span>
    format<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token comment">// The format to which parse the in the input. Ex: dd-MM-yyyy HH:mm:ss. Accepts any valid date-fns library formats</span>
    valueFormat<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token comment">// The format to which parse the value. Ex: dd-MM-yyyy HH:mm:ss. Accepts any valid date-fns library formats</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="iiselectparameterdata" tabindex="-1"><a class="header-anchor" href="#iiselectparameterdata" aria-hidden="true">#</a> IISelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IISelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> SelectModelType
    options<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>TSelectOption<span class="token operator">></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="imiselectparameterdata" tabindex="-1"><a class="header-anchor" href="#imiselectparameterdata" aria-hidden="true">#</a> IMISelectParameterData</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IMISelectParameterData</span> <span class="token keyword">extends</span> <span class="token class-name">TBaseParameterData</span> <span class="token punctuation">{</span>
    defaultValue<span class="token operator">:</span> SelectModelType
    options<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>TSelectOption<span class="token operator">></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="iparameterconditiongroup" tabindex="-1"><a class="header-anchor" href="#iparameterconditiongroup" aria-hidden="true">#</a> IParameterConditionGroup</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">IParameterConditionGroup</span> <span class="token punctuation">{</span>
    parameterConditionList<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>TParameterCondition<span class="token operator">></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tparametercondition" tabindex="-1"><a class="header-anchor" href="#tparametercondition" aria-hidden="true">#</a> TParameterCondition</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">TParameterCondition</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    parameterConditionJPath<span class="token operator">:</span> <span class="token builtin">string</span>
    parameterConditionOperator<span class="token operator">:</span> <span class="token string">'&lt;='</span> <span class="token operator">|</span> <span class="token string">'isEmpty'</span> <span class="token operator">|</span> <span class="token string">'isNotEmpty'</span> <span class="token operator">|</span> <span class="token string">'&lt;'</span> <span class="token operator">|</span> <span class="token string">'='</span> <span class="token operator">|</span> <span class="token string">'>'</span> <span class="token operator">|</span> <span class="token string">'>='</span>
    parameterConditionValue<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">number</span> <span class="token comment">// Only required when specified parameterConditionOperator which has value for comparison</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>For parameter data the logic is:</p>
<ul>
<li>Outer array elements are OR condition</li>
<li>Inner array elements are AND condition</li>
</ul>
<p>For example such configuration:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> conditions<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token builtin">Array</span><span class="token operator">&lt;</span>TParameterCondition<span class="token operator">>></span> <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            parameterConditionJPath<span class="token operator">:</span> <span class="token string">'$.name'</span><span class="token punctuation">,</span>
            parameterConditionOperator<span class="token operator">:</span> <span class="token string">'isEmpty'</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            parameterConditionJPath<span class="token operator">:</span> <span class="token string">'$.age'</span><span class="token punctuation">,</span>
            parameterConditionOperator<span class="token operator">:</span> <span class="token string">'>'</span><span class="token punctuation">,</span>
            parameterConditionValue<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
            parameterConditionJPath<span class="token operator">:</span> <span class="token string">'$.name'</span><span class="token punctuation">,</span>
            parameterConditionOperator<span class="token operator">:</span> <span class="token string">'='</span><span class="token punctuation">,</span>
            parameterConditionValue<span class="token operator">:</span> <span class="token string">'none'</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Means that the parameter will be displayed if (the <code v-pre>name</code> has no value) OR (<code v-pre>name</code> equals to 'none' AND value of <code v-pre>age</code> is bigger than 2)</p>
<h2 id="tcomponenttype" tabindex="-1"><a class="header-anchor" href="#tcomponenttype" aria-hidden="true">#</a> TComponentType</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">TComponentType</span> <span class="token operator">=</span> <span class="token string">'NSelect'</span> <span class="token operator">|</span> <span class="token string">'IDataSelect'</span> <span class="token operator">|</span> <span class="token string">'YNSelect'</span> <span class="token operator">|</span> <span class="token string">'DTSelect'</span> <span class="token operator">|</span> <span class="token string">'PNInput'</span> <span class="token operator">|</span> <span class="token string">'LangSelect'</span> <span class="token operator">|</span> <span class="token string">'String'</span> <span class="token operator">|</span> <span class="token string">'AotSelect'</span> <span class="token operator">|</span> <span class="token string">'MISelect'</span> <span class="token operator">|</span> <span class="token string">'ISelect'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="tparametercategorydisplaytypenames" tabindex="-1"><a class="header-anchor" href="#tparametercategorydisplaytypenames" aria-hidden="true">#</a> TParameterCategoryDisplayTypeNames</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">TParameterCategoryDisplayTypeNames</span> <span class="token operator">=</span> <span class="token string">'plain'</span> <span class="token operator">|</span> <span class="token string">'collapse'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="formpromisetype" tabindex="-1"><a class="header-anchor" href="#formpromisetype" aria-hidden="true">#</a> FormPromiseType</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">FormPromiseType</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    isValid<span class="token operator">:</span> <span class="token builtin">boolean</span>
    invalidFields<span class="token operator">:</span> <span class="token builtin">unknown</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="icustomcomponents" tabindex="-1"><a class="header-anchor" href="#icustomcomponents" aria-hidden="true">#</a> ICustomComponents</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'vue'</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">ICustomComponents</span> <span class="token punctuation">{</span>
    <span class="token punctuation">[</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> Component
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


