<script setup>
import { computed } from 'vue'

const props = defineProps({
  microProps: {
    type: Object,
    default: () => ({}),
  },
})

const cards = computed(() => {
  return (
    props.microProps.preloadData?.cards ?? [
      { label: '线索转化率', value: '36.8%' },
      { label: '区域 GMV', value: '1260 万' },
      { label: '渠道新增客户', value: '284' },
    ]
  )
})

const funnel = ['线索池', '有效商机', '报价跟进', '成交']
const regions = ['华东 42%', '华南 26%', '华北 18%', '其他 14%']
const channels = ['直营 38%', '经销 34%', '伙伴 28%']
</script>

<template>
  <section class="analytics-page">
    <header class="hero">
      <div>
        <p class="analytics-tag">Vue3 + Vite + qiankun</p>
        <h1>运营分析中心</h1>
        <p>现代数据域也纳入统一菜单与权限体系，先消费父应用预取数据，再补充细项分析。</p>
      </div>
      <div class="analytics-panel">
        <h2>父应用上下文</h2>
        <ul>
          <li>角色：{{ microProps.role || 'ops_analyst' }}</li>
          <li>租户：{{ microProps.tenantId || 'tenant-east' }}</li>
          <li>挂载方式：registerMicroApps 整页编排</li>
        </ul>
      </div>
    </header>

    <div class="cards">
      <article v-for="card in cards" :key="card.label">
        <strong>{{ card.value }}</strong>
        <span>{{ card.label }}</span>
      </article>
    </div>

    <div class="charts">
      <section>
        <h2>销售漏斗</h2>
        <ul>
          <li v-for="item in funnel" :key="item">{{ item }}</li>
        </ul>
      </section>
      <section>
        <h2>区域 GMV 分布</h2>
        <ul>
          <li v-for="item in regions" :key="item">{{ item }}</li>
        </ul>
      </section>
      <section>
        <h2>渠道转化趋势</h2>
        <ul>
          <li v-for="item in channels" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>
  </section>
</template>
