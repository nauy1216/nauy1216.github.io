# 基于element-ui封装的一个行可拖动的表格

```
<script>
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'

const OriginRowRender = ElTable.components.TableBody.methods.rowRender
OriginRowRender.isElementUi = true

const INSERT_TYPE = {
  BEFORE: 'before', // 插入到当前元素的顶部
  AFTER: 'after', // 插入到当前元素的底部
  TABlE_BOTTOM: 'bottom' // 插入到表格的底部
}
const TABLE_EVENT_TYPE = {
  DRAG_START: 'jxdragstart',
  DRAG_OVER: 'jxdragover',
  DRAG_END: 'jxdragend',
  DROP: 'jxdrop',
  CLICK_PICK: 'jxclickpick'
}
const OUT_EVENT_TYPE = {
  DRAG_END: 'jxdragend'
}
const DRAGTABLE_DISABLED = 'drag-disabled'

/**
 * 新增属性：
 * isBindData: boolean  是否绑定表格数据，默认绑定。
 *
 * 新增事件：
 * jxdragend 拖拽成功后触发
 */
export default {
  props: {
    isBindData: {
      // 是否绑定表格数据
      type: Boolean,
      default: true
    },
    delay: {
      // 节流设定的触发频率
      type: Number,
      default: 80
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      dragEle: null,
      targetEle: null,
      clickPickEle: null,
      insertType: INSERT_TYPE.BEFORE,
      dragData: null,
      targetData: null
    }
  },

  render(h) {
    let table = h(
      ElTable,
      {
        ref: 'table',
        attrs: {
          ...this.$attrs,
          elDraggable: this.draggable
        },
        staticClass: 'dragtable'
      },
      [this.$slots.default]
    )
    let splitLine = h('div', {
      ref: 'splitline',
      staticClass: 'dragtable-splitline'
    })
    let dragTableWrap = h(
      'div',
      {
        staticClass: 'dragtable-wrap'
      },
      [table, splitLine]
    )
    return dragTableWrap
  },

  created() {
    this.overrideRenderRow()
  },

  mounted() {
    let tableVM = this.$refs.table
    // 监听拖拽事件
    tableVM.$on(TABLE_EVENT_TYPE.DRAG_START, this.handleDragStart)
    tableVM.$on(TABLE_EVENT_TYPE.DRAG_OVER, this.handleDragOver)
    tableVM.$on(TABLE_EVENT_TYPE.DRAG_END, this.handleDragEnd)
    tableVM.$on(TABLE_EVENT_TYPE.DROP, this.handleDrop)
    tableVM.$on(TABLE_EVENT_TYPE.CLICK_PICK, this.handleClickPick)
  },

  methods: {
    overrideRenderRow() {
      try {
        if (OriginRowRender.isElementUi) {
          // 在这里为了直接能够给tr元素增加事件
          // 重写了rowRender方法
          // 在tr的事件回调内部触发el-table组件的事件
          // 在el-table外部只要监听事件做相应的处理即可
          ElTable.components.TableBody.methods.rowRender = function(row, $index, treeRowData) {
            let tableVM = this.$parent
            let vnode = OriginRowRender.call(this, row, $index, treeRowData)
            if (!tableVM.$attrs.elDraggable) {
              return vnode
            }
            vnode.data.on.dragstart = ev => {
              tableVM.$emit(TABLE_EVENT_TYPE.DRAG_START, ev, row)
            }
            vnode.data.on.dragover = ev => {
              tableVM.$emit(TABLE_EVENT_TYPE.DRAG_OVER, ev, row)
            }
            vnode.data.on.dragend = ev => {
              tableVM.$emit(TABLE_EVENT_TYPE.DRAG_END, ev, row)
            }
            vnode.data.on.drop = ev => {
              tableVM.$emit(TABLE_EVENT_TYPE.DROP, ev, row)
            }
            vnode.data.on.mousedown = ev => {
              tableVM.$emit(TABLE_EVENT_TYPE.CLICK_PICK, ev, row)
            }
            vnode.data.attrs = vnode.data.attrs || {}
            vnode.data.attrs.draggable = true
            return vnode
          }
        }
      } catch (e) {
        console.error('Error in overrideRenderRow method.')
      }
    },
    // 在鼠标点击的那一刻记录当前的元素
    // 这一步很重要， 可以使有自定义属性drag-disabled的元素禁用拖拽。
    handleClickPick(ev) {
      this.clickPickEle = ev.target
    },
    handleDragStart(ev, row) {
      // 是否禁用拖拽
      if (this.clickPickEle && this.clickPickEle.getAttribute(DRAGTABLE_DISABLED)) {
        ev.preventDefault()
      }
      ev.stopPropagation()
      event.dataTransfer.effectAllowed = 'move'
      // 记录拖拽的行
      this.dragEle = ev.target
      // 行对应的数据
      this.dragData = row
    },
    handleDragOver(ev, row) {
      ev.stopPropagation()
      ev.preventDefault()
      if (!ev.currentTarget.getAttribute('draggable')) {
        return false
      }
      if (this.timer) return
      let currentTargetDom = ev.currentTarget

      // 做节流处理
      this.timer = setTimeout(() => {
        let splitLineDom = this.$refs.splitline
        let tableDom = this.$refs.table.$el
        let tableRect = tableDom.getBoundingClientRect()
        let currentTargetRect = currentTargetDom.getBoundingClientRect()
        let tableTop = tableRect.top
        let tableHeight = tableRect.height
        let currentTop = currentTargetRect.top
        let currentHeight = currentTargetRect.height
        
        // 判断鼠标指针在当前target元素的位置，
        // 如果指针在target元素的上半部分则将splitline移动到target元素的顶部，
        // 如果在下半部分则移动到底部。
        // 同时使用insertType来记录插入的位置
        let isBefore = ev.clientY - currentTop < currentHeight / 2
        if (isBefore) { // target元素顶部
          splitLineDom.style.top = `${currentTop - tableTop}px`
          this.insertType = INSERT_TYPE.BEFORE
        } else { // target元素底部
          splitLineDom.style.top = `${currentTop - tableTop + currentHeight}px`
          this.insertType = INSERT_TYPE.AFTER
        }
        // 表格底部
        if (!isBefore && !currentTargetDom.nextElementSibling) {
          splitLineDom.style.top = `${tableHeight}px`
          this.insertType = INSERT_TYPE.TABlE_BOTTOM
        }
        // 记录target元素的信息
        this.targetEle = currentTargetDom
        this.targetData = row
        this.timer = null
      }, this.delay)
    },

    handleDragEnd(ev, row) {
      ev.stopPropagation()
      setTimeout(() => {
      	// 获取拖拽元素和目标元素的数据
        let dragRowData = this.dragData
        let targetRowData = this.targetData
        let { data } = this.$attrs
        let dragRowIndex = data.indexOf(dragRowData)
        let targetRowIndex = data.indexOf(targetRowData)
        
        if (this.dragEle && this.targetEle && data) {
          if (this.insertType === INSERT_TYPE.TABlE_BOTTOM) {
          	// 如果是 isBindData， 则直接操作数据
            if (this.isBindData) {
              data.splice(dragRowIndex, 1)
              data.push(dragRowData)
            } else {
            // 只操作dom不改变数据
              this.targetEle.parentNode.appendChild(this.dragEle)
            }
          } else if (this.insertType === INSERT_TYPE.BEFORE) {
            if (this.isBindData) {
              let offset = dragRowIndex < targetRowIndex ? -1 : 0
              data.splice(dragRowIndex, 1)
              data.splice(targetRowIndex + offset, 0, dragRowData)
            } else {
              this.targetEle.parentNode.insertBefore(this.dragEle, this.targetEle)
            }
          } else if (this.insertType === INSERT_TYPE.AFTER) {
            if (this.isBindData) {
              let offset = dragRowIndex < targetRowIndex ? 0 : 1
              data.splice(dragRowIndex, 1)
              data.splice(targetRowIndex + offset, 0, dragRowData)
            } else {
              this.targetEle.parentNode.insertBefore(
                this.dragEle,
                this.targetEle.nextElementSibling
              )
            }
          }
        }
		
		
		// 如果不绑定数据则在事件回调传入数据的副本， 避免在回调中由于
		// 操作数据导致视图变化 
        if (!this.isBindData) {
          try {
            dragRowData = JSON.parse(JSON.stringify(dragRowData))
            targetRowData = JSON.parse(JSON.stringify(targetRowData))
          } catch (e) {
            console.error(e)
          }
        }

        this.$emit(OUT_EVENT_TYPE.DRAG_END, {
          dragRowData: dragRowData,
          targetRowData: targetRowData,
          insertType: this.insertType
        })

        this.dragEle = null
        this.dragData = null
        this.targetEle = null
        this.targetData = null
        this.clickPickEle = null
        this.insertType = null
        this.$refs.splitline.style.cssText = 'top: -9999px;'
      }, this.delay)
    },

    handleDrop(ev) {
      event.preventDefault()
    }
  }
}
</script>
<style lang="scss">
.dragtable-wrap {
  position: relative;
  .dragtable-splitline {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #409eff;
    top: -9999px;
    left: 0;
  }
}
</style>
```

