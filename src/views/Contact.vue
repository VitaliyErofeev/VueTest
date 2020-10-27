<template>
  <div class="main-container">
    <div class="toolbar">
      <span>Edit Contact</span>
      <button :disabled="!history.length" @click="undoChanges" class="small">
        Undo
      </button>
    </div>
    <div class="content">
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

        <hr v-if="contactFields.length" />
        <div
          v-for="(value, propertyName, i) in contactFields"
          :key="i"
          class="field"
        >
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

        <!-- block for adding new field for contact -->
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

        <!-- button for adding new field -->
        <button
          v-show="!newField"
          @click.prevent="newField = true"
          class="add-field-btn"
        >
          Add Field
        </button>
        <br />
        <br />
        <button type="submit">Save</button>
        <button class="cancel-button red" @click.prevent="cancelEdit">
          Cancel
        </button>
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

    contactFields: {},
    newField: false,
  }),
  computed: {
    contact() {
      return this.$store.getters.contactById(+this.$route.params.id);
    },
  },
  mounted() {
    // getting values from contact
    this.name = this.contact.name;
    this.sname = this.contact.sname;
    this.phone = this.contact.phone;
    this.contactFields = this.contact.fields;
  },
  methods: {
    cancelEdit() {
      this.$router.push("/");
    },
    openEditField(prop) {
      // open field to edit key and value
      this.editedKey = prop;
      this.editedField.key = prop;
      this.editedField.value = this.contactFields[prop];
    },
    updateField(success) {
      // update field for contact
      if (success) {
        var temp = { ...this.contactFields };
        this.history.push(JSON.parse(JSON.stringify(this.contactFields)));
        delete temp[this.editedKey];
        temp[this.editedField.key] = this.editedField.value;
        this.contactFields = temp;
        this.editedKey = "";
        this.editedField = { key: "", value: "" };
      } else {
        var result = confirm(`Discard changes ?`);
        if (result) {
          this.editedKey = "";
          this.editedField = { key: "", value: "" };
        }
      }
    },
    submitHandler() {
      // updating current contact
      this.$store.dispatch("updateContact", {
        id: this.contact.id,
        name: this.name,
        sname: this.sname,
        phone: this.phone,
        fields: this.contactFields,
      });
      this.$router.push("/");
    },
    removeField(field) {
      // removing field for current contact
      var result = confirm(`Delete field: ${field} ?`);
      if (result) {
        var temp = { ...this.contactFields };
        delete temp[field];
        this.history.push(JSON.parse(JSON.stringify(this.contactFields)));
        this.contactFields = temp;
      }
    },
    addNewField() {
      // add field for current contact
      if (this.key != "" || this.value != "") {
        this.history.push(JSON.parse(JSON.stringify(this.contactFields)));
        this.contactFields[this.key] = this.value;
        this.newField = false;
      } else alert("Field Name or Value is empty");
      this.key = "";
      this.value = "";
    },
    undoChanges() {
      this.contactFields = this.history.pop();
    },
  },
};
</script>
