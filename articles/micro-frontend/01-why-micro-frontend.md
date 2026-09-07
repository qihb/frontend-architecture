
# 第一篇：为什么要微前端？——前端架构演进之路

**<font style="color:rgb(15, 17, 21);">核心要点：</font>**

+ <font style="color:rgb(15, 17, 21);">单体前端应用面临的核心困境：代码量膨胀（50万行+）、构建时间飙升（10分钟→30分钟）、团队协作冲突频发</font>
+ <font style="color:rgb(15, 17, 21);">前端架构演进时间线：静态页面→jQuery时代→MVC框架→组件化时代→微前端架构</font>
+ <font style="color:rgb(15, 17, 21);">微前端的核心理念：将微服务思想应用到前端，将大型应用拆分为可独立开发、测试、部署的子应用</font>
+ <font style="color:rgb(15, 17, 21);">微前端解决的</font>**<font style="color:rgb(15, 17, 21);">不仅是技术问题，更是组织问题</font>**
+ <font style="color:rgb(15, 17, 21);">何时应该采用微前端：团队规模>30人、菜单超过50个、需要多技术栈并存、各模块发布频率差异>3倍</font>

## 开篇、什么是微前端
直白点，就是能把多个不同技术栈，独立代码仓库的前端web项目（pc web端和mobile web端都算）集合到一个浏览器标签下打开，让用户感知就是在一个系统里操作。符合这种业务场景的项目架构，都可以说是微前端了。

## 一、微前端解决了哪些问题
我列举2个实际的例子，都是我之前的公司生产案例，看看他们用微前端是解决了什么问题。

1一家大型保险中介公司，研发团队100-200人的范围，公司有十几条业务线，每个团队各自负责自己的业务线，每条业务线都有自己的管理后台，数据部分打通，界面都是独立的，处理某个业务要登录多个系统，每个城市分公司的组织，产品，人员调整，都需要关联多个团队来处理，新开一个城市更需要个把月的业务系统初始化，严重影响了公司的业务调整决策速度。这个时候公司需要把各个业务线整合到一个管理后台里，高大上的名字就是【xxx中台，xxxSaaS平台】，各个业务线的数据打通，公用一套组织架构和人员角色权限体系。

前端这块面临的挑战就是，怎么快速的把各个管理后台系统整合到一起。前端这块大部分管理后台是vue2的，还有少部分是前后端不分离的项目（JSP，Laravel），当时是在2021年左右，微前端的各种框架已经出来了，qiankun，无界。当时从改造成本，边界把控，时间要求，对qiankun这套不是那么熟悉，保险还是用了iframe的方式接入。新增了一个父容器，子项目模版案例，让其他业务线前端开发参照子项目模版改造一下自己的项目，接入到父容器里，主要就是通信拿到登录状态，父子之间的事件传递。



2一家口腔门诊连锁公司，研发团队20-30人，有80来家门诊店面，核心就是一套门诊接诊业务系统，包含市场营销，患者接诊，医护看诊，物料管理，财务结算，第三方报表系统，还有很多功能没列出来，反正就是公司所有的业务都在这个管理后台里。项目开始还是从外包手里接过来自研迭代，接手过来后，首先面临的问题就是：

1项目代码量很大，用工具统计过50万行，将近2000个文件（如下图），上手熟悉成本较高，当初花了1-2个月才熟悉各个业务模块

2内部代码结构混乱，技术版本都很低，编译发版10分钟以上

<img src="https://cdn.nlark.com/yuque/0/2026/png/692422/1787540310757-25d21372-e7cf-4ad8-87a0-99f746e75356.png" width="1005" title="" crop="0,0,1,1" id="w6kD1" class="ne-image">

接手之后，要继续迭代维护，新增其他模块功能，接入市场，财务，人事，各种报表，项目代码量还会持续增长，打包时间会继续增加，大家都在一个项目里迭代，出现代码冲突的概率增大，一起发版的内容增多，生产有问题只能一起回滚，协同成本会持续增加。

随着公司发展，业务拆分给各个团队独立负责，也可能会接入其他部门的系统或第三方系统。

公司门诊扩张，使用的人员增多，对系统的稳定性要求也会提高，这项目想要架构升级（vue2升级到vue3），基本不可能，涉及的业务面太多，定位问题，遇到一些公共组件，也无法下手改动，影响面太多，改动后的回归测试成本太高，干什么都是束手束脚的。

在这背景需求下，我引入微前端（接入了qiankun），约定：

1新的，较大的独立业务模块，可以单独采用vue3新开项目接入

2老的系统先按业务性质，拆分出来3个项目，独立仓库，制作拆分，不做架构版本升级

3搭建私有化npm，提取跨项目使用的组件

搭好这套体系之后，后面只要跟着公司发展，业务拆分组合，都能满足了，以后就不会说架构要升级，还要停业务，或者用一个新系统整体替换，这种风险都太高不可控。



## 二、微前端又带来了哪些问题
1拆分颗粒度的把控，责任划分，跨团队协作问题

2首屏加载，vue/react框架，切换子系统带来的首屏加载，会让用户突然感知某个业务“加载半天”

3状态管理和父子系统间通信带来的复杂度

4日志监控和版本回归的规则

## 三、微前端要不要引入现在团队项目
<font style="color:rgb(15, 17, 21);">微前端不是“好不好”的技术，而是“适不适合”的方案，我给出一个数据对比，这些数据只是我个人评估的，不是唯一性数据，只是让大家有数据参考对比，实际情况大家可以根据自己的场景决定。</font>

<font style="color:rgb(15, 17, 21);">我建议从以下四个维度逐层评估，任何一个维度出现</font>**<font style="color:rgb(15, 17, 21);">红色预警</font>**<font style="color:rgb(15, 17, 21);">，都值得严肃考虑微前端；如果所有维度都是绿色，引入微前端就是过度设计。</font>

#### <font style="color:rgb(15, 17, 21);">维度一：团队规模与组织架构（最核心）</font>
| <font style="color:rgb(15, 17, 21);">指标</font> | <font style="color:rgb(15, 17, 21);">绿色（不建议）</font> | <font style="color:rgb(15, 17, 21);">黄色（可考虑）</font> | <font style="color:rgb(15, 17, 21);">红色（强烈建议）</font> |
| --- | --- | --- | --- |
| <font style="color:rgb(15, 17, 21);">前端团队人数</font> | <font style="color:rgb(15, 17, 21);">< 15 人</font> | <font style="color:rgb(15, 17, 21);">15 ~ 30 人</font> | <font style="color:rgb(15, 17, 21);">> 30 人</font> |
| <font style="color:rgb(15, 17, 21);">独立业务线团队</font> | <font style="color:rgb(15, 17, 21);">1 个</font> | <font style="color:rgb(15, 17, 21);">2 ~ 3 个</font> | <font style="color:rgb(15, 17, 21);">≥ 4 个</font> |
| <font style="color:rgb(15, 17, 21);">跨团队协作频率</font> | <font style="color:rgb(15, 17, 21);">每天对齐</font> | <font style="color:rgb(15, 17, 21);">每周对齐</font> | <font style="color:rgb(15, 17, 21);">几乎不交流</font> |
| <font style="color:rgb(15, 17, 21);">代码仓库数量</font> | <font style="color:rgb(15, 17, 21);">1 ~ 2 个</font> | <font style="color:rgb(15, 17, 21);">3 ~ 5 个</font> | <font style="color:rgb(15, 17, 21);">> 5 个</font> |


**<font style="color:rgb(15, 17, 21);">核心判断逻辑</font>**<font style="color:rgb(15, 17, 21);">：康威定律（Conway's Law）——</font>**<font style="color:rgb(15, 17, 21);">系统的架构会复制组织的沟通结构</font>**<font style="color:rgb(15, 17, 21);">。</font>

<font style="color:rgb(15, 17, 21);">如果你们 50 个前端分属 6 个业务团队，各自有独立的迭代节奏和发布周期，微前端就是</font>**<font style="color:rgb(15, 17, 21);">组织架构的自然投射</font>**<font style="color:rgb(15, 17, 21);">。反之，如果 10 个人维护一个后台系统，大家天天坐在一起，微前端只会增加不必要的复杂度。</font>

**<font style="color:rgb(15, 17, 21);">真实案例</font>**<font style="color:rgb(15, 17, 21);">：某电商平台，交易、营销、商家、供应链四个团队各 10~15 人，彼此发布的频率完全不同（交易每周 1 次、营销每天 3 次）。引入微前端后，各团队彻底解耦——这是</font>**<font style="color:rgb(15, 17, 21);">组织驱动的架构演进</font>**<font style="color:rgb(15, 17, 21);">。</font>

#### <font style="color:rgb(15, 17, 21);">维度二：业务复杂度的量化评估</font>
| <font style="color:rgb(15, 17, 21);">指标</font> | <font style="color:rgb(15, 17, 21);">绿色（不建议）</font> | <font style="color:rgb(15, 17, 21);">黄色（可考虑）</font> | <font style="color:rgb(15, 17, 21);">红色（强烈建议）</font> |
| --- | --- | --- | --- |
| <font style="color:rgb(15, 17, 21);">前端页面总数</font> | <font style="color:rgb(15, 17, 21);">< 30 页</font> | <font style="color:rgb(15, 17, 21);">30 ~ 80 页</font> | <font style="color:rgb(15, 17, 21);">> 80 页</font> |
| <font style="color:rgb(15, 17, 21);">独立业务模块数</font> | <font style="color:rgb(15, 17, 21);">< 5 个</font> | <font style="color:rgb(15, 17, 21);">5 ~ 10 个</font> | <font style="color:rgb(15, 17, 21);">> 10 个</font> |
| <font style="color:rgb(15, 17, 21);">代码总行数</font> | <font style="color:rgb(15, 17, 21);">< 20 万行</font> | <font style="color:rgb(15, 17, 21);">20 ~ 50 万行</font> | <font style="color:rgb(15, 17, 21);">> 50 万行</font> |
| <font style="color:rgb(15, 17, 21);">构建时间</font> | <font style="color:rgb(15, 17, 21);">< 5 分钟</font> | <font style="color:rgb(15, 17, 21);">5 ~ 15 分钟</font> | <font style="color:rgb(15, 17, 21);">> 15 分钟</font> |


**<font style="color:rgb(15, 17, 21);">核心判断逻辑</font>**<font style="color:rgb(15, 17, 21);">：当代码量超过 50 万行、构建超过 15 分钟时，单体应用的研发效率已经开始</font>**<font style="color:rgb(15, 17, 21);">负向增长</font>**<font style="color:rgb(15, 17, 21);">——人越多，效率反而越低。</font>

<font style="color:rgb(15, 17, 21);">如果你们的核心后台系统，每次 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">npm run build</font>`<font style="color:rgb(15, 17, 21);"> 需要 20 分钟，开发一个新功能需要了解整个系统的路由和状态管理，新入职同事需要 2 周才能跑通项目——这就是</font>**<font style="color:rgb(15, 17, 21);">复杂度已经超过人类认知负荷极限</font>**<font style="color:rgb(15, 17, 21);">的信号。</font>

#### <font style="color:rgb(15, 17, 21);">维度三：技术债务与演进需求</font>
| <font style="color:rgb(15, 17, 21);">指标</font> | <font style="color:rgb(15, 17, 21);">绿色（不建议）</font> | <font style="color:rgb(15, 17, 21);">黄色（可考虑）</font> | <font style="color:rgb(15, 17, 21);">红色（强烈建议）</font> |
| --- | --- | --- | --- |
| <font style="color:rgb(15, 17, 21);">现存技术栈数量</font> | <font style="color:rgb(15, 17, 21);">1 种</font> | <font style="color:rgb(15, 17, 21);">2 种</font> | <font style="color:rgb(15, 17, 21);">≥ 3 种</font> |
| <font style="color:rgb(15, 17, 21);">是否有老旧框架（如 AngularJS）</font> | <font style="color:rgb(15, 17, 21);">无</font> | <font style="color:rgb(15, 17, 21);">有，但计划替换</font> | <font style="color:rgb(15, 17, 21);">有，且无法整体替换</font> |
| <font style="color:rgb(15, 17, 21);">是否计划引入新框架</font> | <font style="color:rgb(15, 17, 21);">否</font> | <font style="color:rgb(15, 17, 21);">2 年内</font> | <font style="color:rgb(15, 17, 21);">正在进行</font> |
| <font style="color:rgb(15, 17, 21);">是否有渐进式重构需求</font> | <font style="color:rgb(15, 17, 21);">无</font> | <font style="color:rgb(15, 17, 21);">有部分</font> | <font style="color:rgb(15, 17, 21);">有强烈需求</font> |


**<font style="color:rgb(15, 17, 21);">核心判断逻辑</font>**<font style="color:rgb(15, 17, 21);">：微前端最独特、最不可替代的价值是——</font>**<font style="color:rgb(15, 17, 21);">渐进式重构的能力</font>**<font style="color:rgb(15, 17, 21);">。</font>

<font style="color:rgb(15, 17, 21);">当你面对一个 5 年前用 AngularJS 写的、500 万行代码的巨型应用时，</font>**<font style="color:rgb(15, 17, 21);">重写</font>**<font style="color:rgb(15, 17, 21);">的成本是千万级别、周期以年计，且业务不允许停摆。微前端允许你：</font>

+ <font style="color:rgb(15, 17, 21);">保留旧模块继续运行（不干扰业务）</font>
+ <font style="color:rgb(15, 17, 21);">新功能用 React/Vue 开发（新模块独立部署）</font>
+ <font style="color:rgb(15, 17, 21);">逐步替换旧模块（分而治之）</font>

<font style="color:rgb(15, 17, 21);">这是</font>**<font style="color:rgb(15, 17, 21);">唯一能实现“飞机飞行中换引擎”</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的方案。如果你的团队正面临这种困境，微前端几乎是一个必选项。</font>

**<font style="color:rgb(15, 17, 21);">真实案例</font>**<font style="color:rgb(15, 17, 21);">：某头部 SaaS 公司的管理后台，AngularJS + Backbone + React 三代技术栈并存，通过微前端实现了</font>**<font style="color:rgb(15, 17, 21);">3 年渐进式迁移</font>**<font style="color:rgb(15, 17, 21);">，旧代码逐步下线，用户无感知。</font>

#### <font style="color:rgb(15, 17, 21);">维度四：发布频率与独立交付需求</font>
| <font style="color:rgb(15, 17, 21);">指标</font> | <font style="color:rgb(15, 17, 21);">绿色（不建议）</font> | <font style="color:rgb(15, 17, 21);">黄色（可考虑）</font> | <font style="color:rgb(15, 17, 21);">红色（强烈建议）</font> |
| --- | --- | --- | --- |
| <font style="color:rgb(15, 17, 21);">各模块发布频率差异</font> | <font style="color:rgb(15, 17, 21);">< 2 倍</font> | <font style="color:rgb(15, 17, 21);">2 ~ 5 倍</font> | <font style="color:rgb(15, 17, 21);">> 5 倍</font> |
| <font style="color:rgb(15, 17, 21);">是否有独立上线需求</font> | <font style="color:rgb(15, 17, 21);">无</font> | <font style="color:rgb(15, 17, 21);">部分模块</font> | <font style="color:rgb(15, 17, 21);">频繁存在</font> |
| <font style="color:rgb(15, 17, 21);">是否希望子团队自主发布</font> | <font style="color:rgb(15, 17, 21);">否</font> | <font style="color:rgb(15, 17, 21);">希望但暂无机制</font> | <font style="color:rgb(15, 17, 21);">强烈需求</font> |


**<font style="color:rgb(15, 17, 21);">核心判断逻辑</font>**<font style="color:rgb(15, 17, 21);">：如果模块 A 每天发布 3 次（营销活动），模块 B 每月发布 1 次（核心交易），把两者绑在一起发布，要么 A 被拖慢，要么 B 被拖累。</font>

<font style="color:rgb(15, 17, 21);">微前端让</font>**<font style="color:rgb(15, 17, 21);">发布节奏解耦</font>**<font style="color:rgb(15, 17, 21);">——每个子应用拥有独立的 CI/CD 流水线，各自按需发布。</font>



## <font style="color:rgb(15, 17, 21);">总结：决策的核心逻辑</font>
**<font style="color:rgb(15, 17, 21);">“不要为了解决技术问题而引入微前端，要为了解决组织问题而引入微前端。”</font>**

<font style="color:rgb(15, 17, 21);">微前端本质上是一种</font>**<font style="color:rgb(15, 17, 21);">组织架构的镜像</font>**<font style="color:rgb(15, 17, 21);">。当你的团队规模、业务复杂度、发布频率达到一定阈值，微前端是从“混乱”走向“秩序”的自然选择。</font>

<font style="color:rgb(15, 17, 21);">但记住：</font>**<font style="color:rgb(15, 17, 21);">微前端不是起点，而是终点</font>**<font style="color:rgb(15, 17, 21);">。它是你解决了模块化、组件化、Monorepo、CI/CD 等一系列基础问题之后的</font>**<font style="color:rgb(15, 17, 21);">最终架构形态</font>**<font style="color:rgb(15, 17, 21);">。如果连基础工程化都没做好，微前端只会让问题更加复杂。</font>
