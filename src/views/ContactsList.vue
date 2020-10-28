<template>
  <div class="main-container">
    <!-- form for adding new contact -->
    <div v-if="add" class="content">
      <div class="toolbar">
        <span>Add New Contact</span>
      </div>
      <form @submit.prevent="submitHandler" class="form">
        <label for="name">Name *</label>
        <input v-model="name" type="text" placeholder="Name.." />

        <label for="sname">Surname *</label>
        <input v-model="sname" type="text" placeholder="SName.." />

        <label for="phone">Phone</label>
        <input v-model="phone" type="text" placeholder="Phone.." />

        <br />
        <button type="submit">Add</button>
        <button class="cancel-button" @click="add = false">Cancel</button>
      </form>
    </div>
    <!-- table for contacts -->
    <div class="contact-list" :class="{ 'disabled-block': add }">
      <div class="toolbar">
        <i class="mdi-plu" />
        <span>Contacts</span>
        <button v-if="!add" @click="openAddForm" class="small">Add</button>
        <button
          v-if="!contacts.length && !add"
          @click="addDemoData"
          class="small"
        >
          Add Demo Data
        </button>
      </div>
      <table v-if="contacts.length">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>SName</th>
            <th>Phone</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, i) in contacts" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ contact.name }}</td>
            <td>{{ contact.sname }}</td>
            <td>{{ contact.phone }}</td>
            <td>
              <button class="button small" @click="openContact(contact)">
                Edit
              </button>
            </td>
            <td>
              <button class="button small red" @click="deleteContact(contact)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactList",
  data: () => ({
    name: "",
    sname: "",
    phone: "",
    add: false,
  }),
  computed: {
    contacts() {
      //stored contact list
      return this.$store.getters.contacts;
    },
  },
  methods: {
    submitHandler() {
      // adding new contact
      if (this.name != "" && this.sname != "") {
        var contact = {
          id: Date.now(),
          name: this.name,
          sname: this.sname,
          phone: this.phone,
          fields: {},
        };
        // calling action from store
        this.$store.dispatch("createContact", contact);
        this.add = false;
      } else alert("Please enter Name and SName");
    },
    addDemoData() {
      //adding demo data for empty store
      let path = "https://jsonplaceholder.typicode.com/users";
      fetch(path)
        .then((response) => response.json())
        .then((contacts) => {
          for (let i = 0; i < 6; i++) {
            this.$store.dispatch("createContact", {
              id: contacts[i].id,
              name: contacts[i].name.split(" ")[0],
              sname: contacts[i].name.split(" ")[1],
              phone: contacts[i].phone,
              fields: {},
            });
          }
        });
    },
    openAddForm() {
      // open adding form section
      this.name = this.sname = this.phone = "";
      this.add = true;
    },
    openContact(contact) {
      // click 'Edit' button on contact line
      this.$router.push("/contacts/" + contact.id);
    },
    deleteContact(contact) {
      // deleting contact
      var result = confirm(
        `Delete contact: ${contact.name + " " + contact.sname} ?`
      );
      if (result) this.$store.dispatch("deleteContact", contact);
    },
  },
};
</script>
