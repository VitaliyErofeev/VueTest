<template>
  <div class="home">
    <div class="toolbar">
      <span>Edit Contact</span>
    </div>
    <div class="add-form">
      <form @submit.prevent="submitHandler" class="form">
        <label for="fname">Name</label>
        <input
          v-model="name"
          data-name="name"
          type="text"
          placeholder="Name.."
        />

        <label for="fname">Surname</label>
        <input
          v-model="sname"
          data-name="sname"
          type="text"
          placeholder="SName.."
        />

        <label for="phone">Phone</label>
        <input
          v-model="phone"
          data-name="phone"
          type="text"
          placeholder="Phone.."
        />

        <hr />

        <div v-for="(value, propertyName, i) in fields" :key="i" class="field">
          <template v-if="propertyName != editedKey">
            <label :for="propertyName">{{ propertyName }}</label>
            <input type="text" :value="value" />
            <button @click.prevent="openEditField(propertyName)" class="small">
              Edit
            </button>
            <button
              @click.prevent="removeField(propertyName)"
              class="small red"
            >
              Remove
            </button>
          </template>
          <template v-else>
            <input
              type="text"
              placeholder="Field Name.."
              v-model="editedField.key"
            />
            <input
              type="text"
              placeholder="Value.."
              v-model="editedField.value"
            />
            <button @click.prevent="updateField(true)" class="small">
              Update
            </button>
            <button @click.prevent="updateField(false)" class="small red">
              Cancel
            </button>
          </template>
        </div>

        <div v-if="newField" class="new-field-block">
          <input type="text" placeholder="Field Name.." v-model="key" />
          <input type="text" placeholder="Value.." v-model="value" />
          <button @click.prevent="addNewField" class="small">
            Add
          </button>
          <button @click.prevent="newField = false" class="small red">
            Cancel
          </button>
        </div>

        <hr />

        <button
          v-show="!newField"
          @click.prevent="addField"
          class="add-field-btn"
        >
          Add Field
        </button>
        <br />
        <br />
        <button>Save</button>
        <button class="cancel-button red" @click="add = false">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    editedKey: "",
    editedField: { key: "", value: "" },
    key: "",
    value: "",

    name: "",
    sname: "",
    phone: "",

    history: [],

    contactFields: {
      test1: 35353,
      dtsss: "fdefdfdf",
    },
    newField: false,
  }),
  computed: {
    fields: {
      get() {
        return this.contactFields;
      },
    },
    contact() {
      return this.$store.getters.contactById(+this.$route.params.id);
    },
  },
  mounted() {
    this.name = this.contact.name;
    this.sname = this.contact.sname;
    this.phone = this.contact.phone;
    //this.fields = this.contact.fields;
  },
  methods: {
    openEditField(prop) {
      this.editedKey = prop;
      this.editedField.key = prop;
      this.editedField.value = this.contactFields[prop];
    },
    updateField(success) {
      if (success) {
        var temp = { ...this.contactFields };
        delete temp[this.editedKey];
        temp[this.editedField.key] = this.editedField.value;
        this.contactFields = temp;
      }
      this.editedKey = "";
      this.editedField = { key: "", value: "" };
    },
    submitHandler() {
      this.$store.dispatch("updateContact", {
        id: this.contact.id,
        name: this.name,
        sname: this.sname,
        phone: this.phone,
        fields: this.fields,
      });
      this.$router.push("/");
    },
    addField() {
      this.newField = true;
    },
    removeField(field) {
      var result = confirm(`Delete field: ${field} ?`);
      if (result) {
        var temp = { ...this.fields };
        delete temp[field];
        this.contactFields = temp;
      }
    },
    addHistory(callback) {
      this.history.push(this.contactFields);
      /* let a = {
        id: 1548,
        fieldName: "fields.test2",
        prev: undefined,
        next: "",
      };*/

      callback();
    },
    addNewField() {
      if (this.key != "" || this.value != "") {
        // this.addHistory(() => {
        this.contactFields[this.key] = this.value;
        this.newField = false;
        // });
      } else alert("Field Name or Value is empty");
    },
  },
};
</script>
