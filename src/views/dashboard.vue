<template>
  <div id="app">
    <b-modal
      data-cy="modal-information"
      v-model="openToast"
      :title="``"
      title-class=""
      header-border-variant="none"
      footer-border-variant="none"
      centered
      hide-footer
      hide-header
      hide-header-close
      size="md"
      content-class=""
    >
      <div class="row">
        <div class="col-12 text-left">
          <img src="@/assets/icon-alert-info.svg" alt="" class="mx-2" data-cy="modal-information-icon">
          <span class="align-middle" data-cy="modal-information-title">Activity berhasil dihapus</span>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="openModalDelete"
      :title="``"
      title-class=""
      header-border-variant="none"
      footer-border-variant="none"
      centered
      hide-header-close
      size="md"
      data-cy="modal-delete"
      content-class="rounded-12 px-4 pt-4"
    >
      <div class="row" data-cy="todo-modal-delete">
        <div class="col-12 text-center">
          <img src="@/assets/icon-alert.svg" alt="" data-cy="modal-delete-icon">
        <p class="fs-18">Apakah anda yakin menghapus activity <b>"New activity"</b> ?</p>
        </div>
      </div>
      <template #modal-footer="{cancel}">
        <div class="row">
          <div class="col-6 text-right">
            <button class="btn bg-second btn-primer fs-18 fw-600" @click="cancel" data-cy="modal-delete-cancel-button">Batal</button>
          </div>
           <div class="col-6 text-left">
            <button class="btn bg-danger btn-primer fs-18 fw-600" @click="doDelete()" data-cy="modal-delete-confirm-button">Hapus</button>
          </div>
        </div>
      </template>
    </b-modal>
    <div class="container drawing">
      <div class="row py-5">
        <div class="col-6">
          <p class="mb-0 fs-36 fw-700" data-cy="activity-title">Activity</p>
        </div>
        <div class="col-6 text-center">
          <button @click="addActivity" class="btn bg-primer btn-primer fs-18 fw-600" data-cy="activity-add-button"><img src="@/assets/icon-plus.svg" alt=""> Tambah</button>
        </div>
      </div>
      <div class="col-12" v-if="listActivity.length == 0">
        <img src="@/assets/activity-empty-state.svg" alt="" class="pointer">
      </div>
      <div class="row" v-else>
        <div class="col-3" v-for="(item, idx) in listActivity" :key="idx">
          <div class="activity-card w-100" data-cy="activity-item" id="itemTodo0">
            <router-link tag="div" :to="{name: 'detail', params: { id: item.id }}" class="activity-body">
              <p data-cy="activity-item-title" class="fs-18 fw-700">{{item.title}}</p>
            </router-link>
            <div class="card-footer">
              <span data-cy="activity-item-date" class="fs-14">{{$moment(item.created_at).format("YYYY MMMM DD") }} </span>
              <img src="@/assets/icon-delete.svg" alt="delete" data-cy="activity-item-delete-button" @click="doingDelete(item)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  mounted() {
    this.getListActivity()
  },
  data() {
    return {
      openToast: false,
      listActivity: [],
      openModalDelete: false,
      selectorId: null
    }
  },
  methods: {
    doingDelete(item) {
      this.selectorId = item.id
      this.openModalDelete = true;
    },
    async addActivity () {
        let res = await this.$http.post("activity-groups" ,{title:"New Activity",email:"ryanalfarisi28@gmail.com"});
        if(res.status >= 200) {
          this.getListActivity()
        }
    },
    async getListActivity() {
      let res = await this.$http.get("activity-groups?email=ryanalfarisi28@gmail.com");
      if(res.status == 200) {
        this.listActivity = res.data.data
      }
    },
    async doDelete() {
      let res = await this.$http.delete(`activity-groups/${this.selectorId}`);
      console.log(res)
      if(res.status == 200) {
        this.openModalDelete = false
        this.openToast = true;
        this.getListActivity()
      }
    }
  }
}
</script>
<style scoped>
.activity-card {
    background-color: #fff;
    border-radius: 12px;
    padding: 22px 27px;
    margin-bottom: 26px;
    position: relative;
    box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
}
.activity-card .activity-body {
    cursor: pointer;
    height: 158px;
}
.activity-card .card-footer {
    position: absolute;
    z-index: 2;
    bottom: 25px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border: 0;
    width: calc(100% - 54px);
    padding: 0;
}
.activity-card .card-footer span {
    color: #888;
}
.card-footer > img {
  cursor: pointer;
}
.rounded-12 {
  border-radius: 12px;
}
</style>
