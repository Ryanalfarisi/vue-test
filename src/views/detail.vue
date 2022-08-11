<template>
  <div id="app">
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
          <img src="@/assets/icon-alert.svg" alt="">
        <p class="fs-18">Apakah anda yakin menghapus activity <b>"{{selectedItem}}"</b> ?</p>
        </div>
      </div>
      <template #modal-footer="{cancel}">
        <div class="row">
          <div class="col-6 text-right">
            <button class="btn bg-second btn-primer fs-18 fw-600" data-cy="modal-delete-cancel-button" @click="cancel">Batal</button>
          </div>
           <div class="col-6 text-left">
            <button class="btn bg-danger btn-primer fs-18 fw-600" data-cy="modal-delete-confirm-button" @click="doDeleteItem()">Hapus</button>
          </div>
        </div>
      </template>
    </b-modal>
    <b-modal
      v-model="openModalListItem"
      hide-header-close
      header-border-variant="none"
      title-class="px-0"
      centered
      size="lg"
      content-class="rounded-12 px-4 pt-4"
    >
      <div class="row">
        <div class="col-6">
          <h5 data-cy="modal-add-title">Tambah List Item</h5>
        </div>
        <div class="col-6 text-right">
          <img src="@/assets/icon-close.svg" alt="" class="pointer" @click="openModalListItem = false" data-cy="modal-add-close-button">
        </div>
      </div>
      <div class="row">
        <div class="col-12 px-0 my-3">
            <label class="sr-only mb-1 fs-12" for="list_item" data-cy="modal-add-name-title"><b>NAMA LIST ITEM</b></label>
            <b-form-input
                data-cy="modal-add-name-input"
                id="list_item"
                v-model="activityName"
                class="py-2 fs-18"
                placeholder="Tambahkan nama activity"
            />
        </div>
        <div class="col-12 px-0 my-3">
            <label class="sr-only mb-1 fs-12" for="list_priority" data-cy="modal-add-priority-title"><b>PRIORITY</b></label>
            <v-select
              v-model="priority"
              label="label"
              :clearable="false"
              class="w-25 selected-primer"
              :reduce="e => e.value"
              :value="e => e.value"
              :options="optionsPriority"
            >
                <template slot="option" slot-scope="option">
                    <div class="sign-selected d-inline-block" :style="{background: option.color}"></div>
                    <span class="mx-2">{{ option.label }} </span>
                </template>
                <template #selected-option-container="{ option }">
                    <div class="vs__selected">
                        <span class="sign-selected" :style="{background: option.color}"></span>
                        <span class="mx-2">
                            {{ option.label }}
                        </span>
                    </div>
                </template>
            </v-select>
        </div>
      </div>
      <template #modal-footer="{}">
        <div class="row">
          <div class="col-12 text-right">
            <button @click="addTodoItem" class="btn bg-primer btn-primer fs-18 fw-600" :disabled="!activityName" data-cy="modal-add-save-button">Simpan</button>
          </div>
        </div>
      </template>
    </b-modal>
    <div class="container drawing">
      <div class="row py-5">
        <div class="col-6">
            <router-link tag="img" :to="{name: 'dashboard'}" src="@/assets/icon-back.svg" alt="" class="pointer" data-cy="todo-back-button" />
            <b-form-input v-if="editMode" v-model="title" placeholder="Enter your name"
                class="d-inline-block w-75 input-raw fs-32 font-weight-bold" @blur="updateTitle"></b-form-input>
            <span v-else class="mb-0 fs-36 fw-700 align-middle" data-cy="todo-title">{{title}}</span>
            <img src="@/assets/icon-edit.svg" alt="" class="mx-3 pointer" @click="editMode = !editMode" data-cy="todo-title-edit-button">
        </div>
        <div class="col-6" style="text-align: right">
            <b-dropdown size="lg"  variant="link" toggle-class="btn-sort" no-caret data-cy="todo-sort-button">
                <template #button-content>
                   <img src="@/assets/icon-sort.svg" alt="" data-cy="sort-selection-icon">
                </template>
                <b-dropdown-item v-for="(item,idx) in sortingOptions" :key="idx"
                  class="fs-16 py-2" :class="sortingOptions.length == idx+1 ? '' : 'bb-solid'"
                  @click="filtering(item.value)"
                  data-cy="sort-selection-selected"
                >
                  <img :src="item.img" alt="" width="25"> {{item.label}} <img src="@/assets/icon-check.svg" alt="" v-if="tipes == item.value" class="position-check" data-cy="sort-selection-title">
                </b-dropdown-item>
            </b-dropdown>
            <button @click="openModalListItem = true" class="btn bg-primer btn-primer fs-18 fw-600" data-cy="todo-add-button">
              <img src="@/assets/icon-plus.svg" alt="">Tambah
            </button>
        </div>
      </div>
      <div class="col-12 text-center" v-if="listItems.length == 0" data-cy="todo-empty-state">
        <img src="@/assets/empty-item.png" alt="" class="pointer">
      </div>
      <div class="row" v-else>
        <div class="content-item" v-for="(list,idx) in listItems" :key="idx" data-cy="todo-item">
            <div class="row">
                <div class="col-6 my-auto">
                    <b-form-checkbox
                      data-cy="todo-item-checkbox"
                      class="d-inline-block mx-3 align-middle"
                      :id="`checkbox-${idx}`"
                      v-model="status[list.id]"
                    />
                    <div class="sign-selected d-inline-block align-middle" :style="{background: selectedColor(list.priority)}" data-cy="todo-item-priority-indicator"></div>
                    <span class="mx-3 align-middle" data-cy="todo-item-title" :class="status[list.id] ? 'strike-it' : ''"><b>{{ list.title }}</b></span>
                    <img src="@/assets/icon-edit.svg" alt=""
                      class="mx-3 pointer" width="20" @click="toEditTodo(list)"
                      data-cy="todo-item-edit-button">
                </div>
                <div class="col-6 text-right">
                    <img src="@/assets/icon-delete.svg" alt="" class="mx-3 pointer"
                    data-cy="todo-item-delete-button"
                    width="20" @click="toDeleted(list)">
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
    this.getListDetail()
  },
  data() {
    return {
        status: [],
        sortingOptions: [
          {
            label: "Terbaru",
            value: "newest",
            img: require("@/assets/icon-sort-newest.svg")
          },
          {
            label: "Terlama",
            value: "oldest",
            img: require("@/assets/icon-sort-oldest.svg")
          },
          {
            label: "A-Z",
            value: "asc",
            img: require("@/assets/icon-sort-a-alpha.svg")
          },
          {
            label: "Z-A",
            value: "desc",
            img: require("@/assets/icon-sort-d-alpha.svg")
          },
          {
            label: "Belum Selesai",
            value: "no",
            img: require("@/assets/icon-sort-active.svg")
          }
        ],
        selectedItem: "",
        openModalDelete: false,
        selectedId: null,
        activityName: "",
        optionsPriority: [
            {
                label: "Very High",
                value: "very-high",
                color: "#ed4c5c"
            },
            {
                label: "High",
                value: "high",
                color: "#f8a540"
            },
            {
                label: "Medium",
                value: "normal",
                color: "#1ba791"
            },
            {
                label: "Low",
                value: "low",
                color: "#428bc1"
            },
            {
                label: "Very Low",
                value: "very-low",
                color: "#8943c1"
            }
        ],
        tipes: "newest",
        priority: "very-high",
        openModalListItem: false,
        editMode: false,
        listItems: [],
        title: null
    }
  },
  methods: {
    filtering(type) {
      this.tipes = type
      if(type == 'newest') {
        this.listItems = this.listItems.sort((a, b) =>
            a.id < b.id ? 1 : b.id < a.id ? -1 : 0,
          );
      } else if(type == 'oldest') {
        this.listItems = this.listItems.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
          );
      } else if(type == 'asc') {
        this.listItems = this.listItems.sort((a, b) =>
            a.title > b.title ? 1 : b.title > a.title ? -1 : 0,
          );
      } else if(type == 'desc') {
        this.listItems = this.listItems.sort((a, b) =>
            a.title < b.title ? 1 : b.title < a.title ? -1 : 0,
          );
      } else {
        this.listItems = this.listItems.sort((a, b) =>
          this.status[a.id] > this.status[b.id] ? 1 : this.status[b.id] > this.status[a.id] ? -1 : 0,
        );
      }
    },
    selectedColor(type) {
        let find = this.optionsPriority.find(e => e.value == type);
        return find.color;
    },
    async getListDetail() {
        let res = await this.$http.get(`activity-groups/${this.$route.params.id}`);
        if(res.status == 200) {
            this.title = res.data.title
            this.listItems = res.data.todo_items
        }
    },
    async updateTitle() {
        await this.$http.patch(`activity-groups/${this.$route.params.id}`, {
            title: this.title
        });
        this.editMode = false
        this.getListDetail()
    },
    async addTodoItem() {
        const payload = {
            activity_group_id: this.$route.params.id,
            priority: this.priority,
            title: this.activityName
        }
        if(this.selectedId) {
            await this.$http.patch(`todo-items/${this.selectedId}`, payload);
        } else {
            await this.$http.post(`todo-items`, payload);
        }
        this.getListDetail()
        this.openModalListItem = false
        this.activityName = ""
        this.selectedId = null
    },
    async doDeleteItem() {
        await this.$http.delete(`todo-items/${this.selectedId}`);
        this.getListDetail()
        this.openModalDelete = false

    },
    toDeleted(item) {
        this.selectedId = item.id
        this.selectedItem  = item.title
        this.openModalDelete = true
    },
    toEditTodo(item) {
        this.selectedId = item.id
        this.priority = item.priority
        this.activityName = item.title
        this.openModalListItem = true
    }
  }
}
</script>
<style>
.bb-solid {
    border-bottom: 1px solid #e5e5e5;
}
.content-item {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 27px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
}
.sign-selected {
    width: 17px;
    height: 17px;
    border-radius: 50%;
}
.selected-primer .vs__selected-options {
    padding: 8px !important;
}
.input-raw:focus {
     outline: none !important;
}
.input-raw {
    border: none !important;
    border-bottom: 1px solid !important;
    border-radius: 0px !important;
    outline: none;
}
.btn-sort {
    border: 1px solid #e5e5e5 !important;
    border-radius: 50% !important;
    padding: 10px 14px !important;
    margin-right: 10px;
}
.rounded-12 {
    border-radius: 12px;
}
.text-right {
    text-align: right;
}
.position-check {
  margin-left: 20px;
}
.strike-it {
  color: #888;
  text-decoration: line-through;
}
</style>
