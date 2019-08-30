<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">
        {{ $t('department_page_title') }}
      </span>
      <div class="page__header--btn">
        <span class="mr30 pointer" @click="handleTypeChange()">
          <i
            class="iconfont pr5"
            :class="{
              'icon-Tree': type === 'list',
              'icon-List': type === 'tree'
            }">
          </i>
          {{ type === 'tree' ? $t('department_header_type_list') : $t('department_header_type_tree') }}
        </span>
        <el-button
          type="primary"
          size="small"
          @click="$router.push({name: 'depInfo'})">
          {{ $t('department_header_btn_add') }}
        </el-button>
      </div>
    </div>

    <list
      v-if="type === 'list'"
      ref="list"
      @delete="handleDelete"
      @move="handleMove">
    </list>
    <tree
      v-else
      ref="tree"
      @delete="handleDelete"
      @move="handleMove">
    </tree>
  </div>
</template>

<script>
import * as api from '@/api/hr/department'
import list from './list'
import tree from './tree'

export default {
  name: 'department',
  data () {
    return {
      type: 'list'
    }
  },
  components: {
    tree,
    list
  },
  methods: {
    handleTypeChange () {
      this.type = this.type === 'list' ? 'tree' : 'list'
    },
    updateChildren (depId) {
      const params = { depId }
      api.getdepTree(params).then(res => {
        if (res.success) {
          this.$refs[this.type].$refs.tree.updateKeyChildren(depId, res.data.departmentVOS)
        }
      })
    },
    // 上移，下移
    handleMove (node, disabled, sort) {
      if (disabled) return
      const parentDepId = node.parent.data.id
      const params = {
        parentDepId: parentDepId,
        depIds: node.parent.childNodes.map(ele => ele.data.id)
      }
      const index = params.depIds.indexOf(node.data.id)
      params.depIds.splice(index, 1)
      params.depIds.splice(sort === 'up' ? index - 1 : index + 1, 0, node.data.id)

      api.moveDepartment(params).then(res => {
        if (res.success) {
          this.updateChildren(parentDepId)
        }
      })
    },
    // 删除操作
    handleDelete (node, deleteCurrent) {
      const { id: depId } = node.data
      const parentDepId = node.parent.data.id
      const params = { depId }

      api.getAllDepAndEmp(params).then(res => {
        if (res.success) {
          const { empVos = [], departmentVOS = [] } = res.data
          if ((empVos && empVos.length) || (departmentVOS && departmentVOS.length)) {
            this.cannotDelete(depId)
          } else {
            this.canDelete(depId, parentDepId, deleteCurrent)
          }
        }
      })
    },
    // 不能被删除，有子部门，子员工
    cannotDelete (depId) {
      this.$confirm(`
        <p>${this.$t('department_cannotDelete_comfirm1')}</p>
        <p>${this.$t('department_cannotDelete_comfirm2')}</p>`, `${this.$t('department_cannotDelete_comfirm3')}`, {
        customClass: 'larger',
        dangerouslyUseHTMLString: true,
        confirmButtonText: `${this.$t('department_cannotDelete_comfirm4')}`,
        center: true
      }).then(() => {
        this.$router.push({
          name: 'employeeList',
          query: {
            depId
          }
        })
      }, () => {})
    },
    // 能删除
    canDelete (depId, parentDepId, deleteCurrent) {
      this.$confirm(this.$t('department_canDelete_comfirm1'), this.$t('department_canDelete_comfirm2'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('department_canDelete_comfirm3'),
        center: true
      }).then(() => {
        api.deleteDepartment(depId).then(res => {
          if (res.success) {
            this.$message.success(this.$t('department_canDelete_comfirm4'))
            this.updateChildren(parentDepId)
            if (deleteCurrent) {
              this.$refs.tree.checkRoot()
            }
          }
        })
      }, () => {})
    }
  }
}
</script>
