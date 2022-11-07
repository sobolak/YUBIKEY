<template>
  <div class="hello">
    <button v-on:click="register()">REGISssTER</button>
    <button v-on:click="login()">LOGssIN</button>
  </div>
</template>

<script>
      import axios from "axios";

  export default {
    name: 'U2F',
    methods: {
      register() {
        if(window.u2f && window.u2f.register){
          axios({method: "GET", url: "https://localhost/register", withCredentials: true}).then(result => {
            window.u2f.register(result.data.appId, [result.data], [], response => {
              axios({ method : "POST", url: "https://localhost/register", data: { registerResponse: response}, headers: {"content-type": "application/json"}, withCredentials: true}).then(result => {
                console.log(result.data);
              }, error => {
                  console.error(error);
              });
            });
          }, error => {
              console.log(error);
          });
        }
      },
      login() {
      if(window.u2f && window.u2f.sign) {
        axios({ method: "GET", "url": "https://localhost/login", withCredentials: true }).then(result => {
            window.u2f.sign(result.data.appId, result.data.challenge, [result.data], response => {
                axios({ method: "POST", "url": "https://localhost/login", "data": { loginResponse: response }, "headers": { "content-type": "application/json" }, withCredentials: true }).then(result => {
                    console.log(result.data);
                });
            });
        });
    } else {
        console.error("U2F is not supported");
    }
}
  }
}
</script>

<style scoped> </style>
